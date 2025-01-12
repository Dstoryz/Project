from django.db.models import Avg, Count, F, Q
from django.utils import timezone
import pandas as pd
from datetime import timedelta

class MetricsService:
    def get_system_metrics(self, days=30):
        """Получает основные метрики системы"""
        end_date = timezone.now()
        start_date = end_date - timedelta(days=days)
        
        return {
            'generation_stats': self._get_generation_stats(start_date, end_date),
            'user_metrics': self._get_user_metrics(start_date, end_date),
            'model_performance': self._get_model_performance(start_date, end_date),
            'system_load': self._get_system_load()
        }
        
    def _get_generation_stats(self, start_date, end_date):
        stats = GenerationStats.objects.filter(
            date__range=(start_date, end_date)
        ).aggregate(
            total=Count('id'),
            success_rate=Avg('successful_generations') * 100.0 / Avg('total_generations'),
            avg_time=Avg('average_generation_time')
        )
        return stats
        
    def _get_user_metrics(self, start_date, end_date):
        return UserAnalytics.objects.filter(
            last_active__range=(start_date, end_date)
        ).aggregate(
            active_users=Count('id'),
            avg_generations=Avg('total_generations'),
            total_generations=Sum('total_generations')
        )
        
    def _get_system_load(self):
        import psutil
        
        return {
            'cpu_percent': psutil.cpu_percent(),
            'memory_percent': psutil.virtual_memory().percent,
            'disk_usage': psutil.disk_usage('/').percent
        } 