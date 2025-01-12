from django.utils import timezone
from datetime import timedelta
from .models import Subscription, SubscriptionPlan
from django.db import transaction

class SubscriptionService:
    def create_subscription(self, user, plan_id, payment_method=None):
        """Создает новую подписку"""
        plan = SubscriptionPlan.objects.get(id=plan_id)
        
        with transaction.atomic():
            # Деактивируем текущую подписку если есть
            Subscription.objects.filter(
                user=user, 
                active=True
            ).update(active=False)
            
            # Создаем новую подписку
            subscription = Subscription.objects.create(
                user=user,
                plan=plan.name,
                active=True,
                expires_at=timezone.now() + timedelta(days=30),
                monthly_generations=plan.monthly_generations,
                features=plan.features
            )
            
            if payment_method:
                self._process_payment(subscription, payment_method)
                
            return subscription
            
    def check_limits(self, user):
        """Проверяет лимиты пользователя"""
        subscription = Subscription.objects.filter(
            user=user,
            active=True,
            expires_at__gt=timezone.now()
        ).first()
        
        if not subscription:
            return {'can_generate': False, 'reason': 'No active subscription'}
            
        # Проверяем количество генераций за месяц
        generations_this_month = user.imagegenerationrequest_set.filter(
            created_at__month=timezone.now().month
        ).count()
        
        if generations_this_month >= subscription.monthly_generations:
            return {
                'can_generate': False,
                'reason': 'Monthly limit reached'
            }
            
        return {
            'can_generate': True,
            'remaining': subscription.monthly_generations - generations_this_month
        } 