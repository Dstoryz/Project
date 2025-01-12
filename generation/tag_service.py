from django.db.models import Count, Q
from django.utils.text import slugify
import nltk
from nltk.tokenize import word_tokenize
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from .models import ImageTag

class TagService:
    def __init__(self):
        # Загружаем NLTK данные при инициализации
        nltk.download('punkt')
        nltk.download('averaged_perceptron_tagger')
        
    def suggest_tags(self, prompt):
        # Токенизация и POS-тэггинг
        tokens = word_tokenize(prompt.lower())
        pos_tags = nltk.pos_tag(tokens)
        
        # Извлекаем существительные и прилагательные
        relevant_words = [
            word for word, pos in pos_tags 
            if pos.startswith(('NN', 'JJ')) and len(word) > 2
        ]
        
        # Ищем существующие теги
        existing_tags = ImageTag.objects.filter(
            Q(name__in=relevant_words) |
            Q(name__in=[slugify(w) for w in relevant_words])
        )
        
        # Добавляем новые теги из релевантных слов
        suggested_tags = list(existing_tags)
        for word in relevant_words:
            if not any(tag.name == word for tag in suggested_tags):
                suggested_tags.append(
                    ImageTag(name=word, is_suggested=True)
                )
                
        return suggested_tags
    
    def merge_tags(self, source_tag, target_tag):
        """Объединяет два тега, перенося все связи"""
        with transaction.atomic():
            # Переносим все изображения с source на target
            target_tag.imagegenerationrequest_set.add(
                *source_tag.imagegenerationrequest_set.all()
            )
            # Удаляем исходный тег
            source_tag.delete()
            
    def cleanup_unused_tags(self, min_usage=0, days_old=30):
        """Удаляет неиспользуемые теги"""
        cutoff_date = timezone.now() - timedelta(days=days_old)
        unused_tags = ImageTag.objects.annotate(
            usage_count=Count('imagegenerationrequest')
        ).filter(
            usage_count__lte=min_usage,
            created_at__lt=cutoff_date
        )
        unused_tags.delete() 