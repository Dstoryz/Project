from datetime import datetime
from django.db import transaction
from .models import GenerationTask
from generation.services import ImageGenerationService

class TaskQueueService:
    def __init__(self):
        self.gen_service = ImageGenerationService()

    @transaction.atomic
    def enqueue_task(self, user, prompt, priority=0):
        task = GenerationTask.objects.create(
            user=user,
            prompt=prompt,
            priority=priority
        )
        return task
    
    def process_next_task(self):
        task = GenerationTask.objects.filter(
            status='pending'
        ).order_by('priority', 'created_at').first()
        
        if not task:
            return None
            
        try:
            task.status = 'processing'
            task.started_at = datetime.now()
            task.save()
            
            result = self.gen_service.generate(
                user=task.user,
                prompt=task.prompt
            )
            
            task.status = 'completed'
            task.completed_at = datetime.now()
            task.save()
            
            return result
            
        except Exception as e:
            task.status = 'failed'
            task.error_message = str(e)
            task.save()
            raise 