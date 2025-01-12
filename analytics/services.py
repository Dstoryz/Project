from django.db.models import Count, Avg, F, Window
from django.db.models.functions import TruncDate
from django.utils import timezone
from .models import GenerationStats, ModelUsageStats, UserAnalytics
import pandas as pd

class AnalyticsService:
    def track_generation(self, image_request):
        # Обновляем дневную статистику
        stats, _ = GenerationStats.objects.get_or_create(
            date=timezone.now().date()
        )
        stats.total_generations += 1
        stats.successful_generations += 1 if image_request.generated_image else 0
        stats.save()
        
        # Обновляем статистику модели
        model_stats, _ = ModelUsageStats.objects.get_or_create(
            model=image_request.model,
            date=timezone.now().date()
        )
        model_stats.usage_count += 1
        model_stats.save()
        
        # Обновляем статистику пользователя
        user_analytics, _ = UserAnalytics.objects.get_or_create(
            user=image_request.user
        )
        user_analytics.total_generations += 1
        user_analytics.last_active = timezone.now()
        user_analytics.save()
    
    def get_user_stats(self, user):
        base_stats = super().get_user_stats(user)
        
        # Добавляем расширенную статистику
        extended_stats = {
            'generation_history': self._get_generation_history(user),
            'model_performance': self._get_model_performance(user),
            'style_preferences': self._get_style_preferences(user),
            'quality_metrics': self._get_quality_metrics(user)
        }
        
        return {**base_stats, **extended_stats}
    
    def _get_favorite_model(self, user):
        return user.imagegenerationrequest_set.values('model')\
            .annotate(count=Count('id'))\
            .order_by('-count').first() 
    
    def _get_generation_history(self, user):
        history = user.imagegenerationrequest_set.annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            count=Count('id'),
            avg_steps=Avg('n_steps'),
            avg_guidance=Avg('guidance_scale')
        ).order_by('date')
        
        return pd.DataFrame(history)
    
    def _get_model_performance(self, user):
        return user.imagegenerationrequest_set.values('model').annotate(
            total=Count('id'),
            success_rate=Count('generated_image', filter=Q(generated_image__isnull=False)) * 100.0 / Count('id'),
            avg_generation_time=Avg('generation_time')
        )
    
    def _get_quality_metrics(self, user):
        return user.imagegenerationrequest_set.aggregate(
            avg_rating=Avg('imagerating__rating'),
            total_favorites=Count('favorites'),
            comment_engagement=Count('imagecomment') * 1.0 / Count('id')
        ) 