from django.db.models import Q, Count, Avg, F, ExpressionWrapper, FloatField, Prefetch
from django.utils import timezone
from datetime import timedelta
from django.db.models.functions import TruncDate, ExtractHour
import pandas as pd

class HistoryService:
    def get_user_history(self, user, filters=None, page=1, page_size=20):
        """Получает историю генераций пользователя с фильтрами"""
        queryset = ImageGenerationRequest.objects.filter(user=user)
        
        # Оптимизируем загрузку изображений
        queryset = queryset.select_related('user').only(
            'id', 'prompt', 'model', 'style', 'created_at',
            'generated_image', 'thumbnail',
            'user__username'
        )
        
        if filters:
            if filters.get('model'):
                queryset = queryset.filter(model=filters['model'])
            if filters.get('style'):
                queryset = queryset.filter(style=filters['style'])
            if filters.get('date_from'):
                queryset = queryset.filter(created_at__gte=filters['date_from'])
            if filters.get('date_to'):
                queryset = queryset.filter(created_at__lte=filters['date_to'])
            if filters.get('has_favorites'):
                queryset = queryset.filter(favorites__isnull=False)
            if filters.get('has_comments'):
                queryset = queryset.filter(imagecomment__isnull=False)
            if filters.get('min_rating'):
                queryset = queryset.annotate(
                    avg_rating=Avg('imagerating__rating')
                ).filter(avg_rating__gte=filters['min_rating'])
                
        # Добавляем аннотации
        queryset = queryset.annotate(
            favorite_count=Count('favorites', distinct=True),
            comment_count=Count('imagecomment', distinct=True),
            avg_rating=Avg('imagerating__rating')
        )
        
        # Пагинация
        start = (page - 1) * page_size
        end = start + page_size
        
        results = queryset.order_by('-created_at')[start:end]
        
        # Форматируем результаты
        return {
            'items': [{
                'id': item.id,
                'prompt': item.prompt,
                'model': item.model,
                'style': item.style,
                'created_at': item.created_at,
                'thumbnail_url': item.thumbnail.url if item.thumbnail else None,
                'image_url': item.generated_image.url if item.generated_image else None,
                'favorite_count': item.favorite_count,
                'comment_count': item.comment_count,
                'avg_rating': float(item.avg_rating) if item.avg_rating else None,
            } for item in results],
            'total': queryset.count(),
            'page': page,
            'page_size': page_size
        }

    def get_generation_trends(self, user, days=30):
        """Анализирует тренды генераций"""
        start_date = timezone.now() - timedelta(days=days)
        
        daily_stats = ImageGenerationRequest.objects.filter(
            user=user,
            created_at__gte=start_date
        ).annotate(
            date=TruncDate('created_at'),
            hour=ExtractHour('created_at')
        ).values('date', 'hour').annotate(
            count=Count('id'),
            avg_guidance=Avg('guidance_scale'),
            avg_steps=Avg('n_steps'),
            success_rate=ExpressionWrapper(
                Count('generated_image', filter=Q(generated_image__isnull=False)) * 100.0 / Count('id'),
                output_field=FloatField()
            )
        ).order_by('date', 'hour')
        
        return pd.DataFrame(daily_stats)

    def get_style_preferences(self, user):
        """Анализирует предпочтения пользователя по стилям"""
        return ImageGenerationRequest.objects.filter(
            user=user
        ).values('style').annotate(
            count=Count('id'),
            avg_rating=Avg('imagerating__rating'),
            favorite_rate=ExpressionWrapper(
                Count('favorites') * 100.0 / Count('id'),
                output_field=FloatField()
            )
        ).order_by('-count')

    def get_user_statistics(self, user):
        """Получает расширенную статистику генераций пользователя"""
        base_stats = {
            'total_generations': ImageGenerationRequest.objects.filter(user=user).count(),
            'successful_generations': ImageGenerationRequest.objects.filter(
                user=user,
                generated_image__isnull=False
            ).count()
        }
        
        # Добавляем расширенную статистику
        extended_stats = {
            'favorite_model': self._get_favorite_model(user),
            'average_settings': self._get_average_settings(user),
            'peak_hours': self._get_peak_hours(user),
            'style_distribution': self._get_style_distribution(user),
            'quality_metrics': self._get_quality_metrics(user)
        }
        
        return {**base_stats, **extended_stats}

    def _get_favorite_model(self, user):
        return ImageGenerationRequest.objects.filter(
            user=user
        ).values('model').annotate(
            usage_count=Count('id'),
            success_rate=ExpressionWrapper(
                Count('generated_image', filter=Q(generated_image__isnull=False)) * 100.0 / Count('id'),
                output_field=FloatField()
            ),
            avg_rating=Avg('imagerating__rating')
        ).order_by('-usage_count').first()

    def _get_average_settings(self, user):
        return ImageGenerationRequest.objects.filter(
            user=user,
            generated_image__isnull=False  # Только успешные генерации
        ).aggregate(
            avg_guidance_scale=Avg('guidance_scale'),
            avg_steps=Avg('n_steps'),
            avg_width=Avg('width'),
            avg_height=Avg('height')
        )

    def _get_peak_hours(self, user):
        return ImageGenerationRequest.objects.filter(
            user=user
        ).annotate(
            hour=ExtractHour('created_at')
        ).values('hour').annotate(
            count=Count('id')
        ).order_by('-count')[:5]

    def _get_style_distribution(self, user):
        return ImageGenerationRequest.objects.filter(
            user=user
        ).values('style').annotate(
            count=Count('id'),
            success_rate=ExpressionWrapper(
                Count('generated_image', filter=Q(generated_image__isnull=False)) * 100.0 / Count('id'),
                output_field=FloatField()
            )
        ).order_by('-count')

    def _get_quality_metrics(self, user):
        return ImageGenerationRequest.objects.filter(
            user=user
        ).aggregate(
            avg_rating=Avg('imagerating__rating'),
            favorite_count=Count('favorites', distinct=True),
            comment_count=Count('imagecomment', distinct=True),
            shared_count=Count('sharedimage', distinct=True)
        ) 