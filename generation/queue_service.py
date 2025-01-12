from django.db import transaction
from django.utils import timezone
from .models import GenerationTask
import redis
import json
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class QueueService:
    def __init__(self):
        self.redis = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB
        )
        self.queue_key = "generation_queue"
        self.max_retries = 3
        
    def calculate_priority(self, user, task_data):
        """Вычисляет приоритет задачи"""
        base_priority = 0
        
        # Проверяем подписку пользователя
        subscription = SubscriptionService().get_active_subscription(user)
        if subscription:
            if subscription.plan == 'enterprise':
                base_priority += 100
            elif subscription.plan == 'pro':
                base_priority += 50
                
        # Учитываем историю пользователя
        user_stats = UserAnalytics.objects.get(user=user)
        if user_stats.total_generations > 1000:
            base_priority += 10
            
        # Учитываем тип задачи
        if task_data.get('is_batch'):
            base_priority -= 20  # Batch задачи имеют меньший приоритет
            
        return base_priority

    def retry_failed_tasks(self):
        """Повторяет попытку для неудавшихся задач"""
        failed_tasks = self.redis.keys("task:*:failed")
        
        for task_key in failed_tasks:
            task_data = self.redis.hgetall(task_key)
            retries = int(task_data.get('retries', 0))
            
            if retries < self.max_retries:
                # Увеличиваем счетчик попыток
                task_data['retries'] = retries + 1
                task_data['status'] = 'pending'
                
                # Возвращаем в очередь с пониженным приоритетом
                self.redis.hmset(task_key, task_data)
                self.redis.zadd(self.queue_key, {task_data['id']: -100})

    def cleanup_old_tasks(self, days=7):
        """Очищает старые задачи"""
        cutoff = timezone.now() - timedelta(days=days)
        
        for key in self.redis.keys("task:*"):
            task_data = self.redis.hgetall(key)
            created_at = datetime.fromisoformat(task_data['created_at'])
            
            if created_at < cutoff:
                self.redis.delete(key)
        
    def enqueue(self, task_data, priority=0):
        """Добавляет задачу в очередь с приоритетом"""
        task = {
            'id': str(uuid.uuid4()),
            'data': task_data,
            'created_at': timezone.now().isoformat(),
            'status': 'pending'
        }
        
        # Сохраняем детали задачи
        task_key = f"task:{task['id']}"
        self.redis.hmset(task_key, task)
        
        # Добавляем в очередь с приоритетом
        self.redis.zadd(self.queue_key, {task['id']: priority})
        
        return task['id']
        
    def dequeue(self):
        """Получает следующую задачу с наивысшим приоритетом"""
        with self.redis.pipeline() as pipe:
            while True:
                try:
                    # Получаем ID задачи с наивысшим приоритетом
                    pipe.watch(self.queue_key)
                    task_id = pipe.zrange(self.queue_key, 0, 0)[0]
                    
                    pipe.multi()
                    pipe.zrem(self.queue_key, task_id)
                    pipe.hgetall(f"task:{task_id}")
                    
                    results = pipe.execute()
                    task_data = results[1]
                    
                    return json.loads(task_data['data'])
                    
                except redis.WatchError:
                    continue
                    
    def get_queue_status(self):
        """Получает статус очереди"""
        return {
            'total_tasks': self.redis.zcard(self.queue_key),
            'processing': self.redis.keys("task:*:processing"),
            'completed': self.redis.keys("task:*:completed"),
            'failed': self.redis.keys("task:*:failed")
        } 