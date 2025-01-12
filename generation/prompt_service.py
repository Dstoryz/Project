from .models import PromptTemplate
from django.db.models import Q
import re
from transformers import pipeline

class PromptService:
    def __init__(self):
        self.sentiment_analyzer = pipeline('sentiment-analysis')
        self.style_keywords = self._load_style_keywords()
        
    def _load_style_keywords(self):
        """Загружает ключевые слова для стилей"""
        return {
            'painting': ['oil painting', 'watercolor', 'acrylic'],
            'digital_art': ['digital art', 'concept art', 'illustration'],
            'photo': ['photograph', 'photorealistic', 'camera'],
            'anime': ['anime', 'manga', 'japanese animation'],
            '3d': ['3d render', 'blender', 'cinema 4d']
        }
        
    def detect_style(self, prompt):
        """Определяет стиль из промпта"""
        prompt_lower = prompt.lower()
        detected_styles = []
        
        for style, keywords in self.style_keywords.items():
            if any(keyword in prompt_lower for keyword in keywords):
                detected_styles.append(style)
                
        return detected_styles or ['digital_art']  # По умолчанию

    def get_negative_prompt(self, style):
        """Возвращает negative prompt для стиля"""
        negative_prompts = {
            'painting': 'photo, photorealistic, camera, lens',
            'digital_art': 'blurry, low quality, draft, sketch',
            'photo': 'painting, illustration, cartoon, anime',
            'anime': 'photorealistic, western style, oil painting',
            '3d': 'flat, 2d, hand drawn, painting'
        }
        return negative_prompts.get(style, '')

    def analyze_prompt_complexity(self, prompt):
        """Анализирует сложность промпта"""
        words = prompt.split()
        
        return {
            'word_count': len(words),
            'unique_words': len(set(words)),
            'has_style': bool(self.detect_style(prompt)),
            'has_colors': any(color in prompt.lower() for color in ['red', 'blue', 'green', 'yellow']),
            'has_composition': any(comp in prompt.lower() for comp in ['foreground', 'background', 'centered'])
        }
        
    def validate_prompt(self, prompt):
        """Проверяет промпт на соответствие требованиям"""
        # Проверка длины
        if len(prompt) < 3 or len(prompt) > 1000:
            return False, "Prompt length should be between 3 and 1000 characters"
            
        # Проверка запрещенных слов
        forbidden_words = self._get_forbidden_words()
        found_words = [w for w in forbidden_words if w in prompt.lower()]
        if found_words:
            return False, f"Prompt contains forbidden words: {', '.join(found_words)}"
            
        # Анализ тональности
        sentiment = self.sentiment_analyzer(prompt)[0]
        if sentiment['label'] == 'NEGATIVE' and sentiment['score'] > 0.8:
            return False, "Prompt has overly negative sentiment"
            
        return True, None
        
    def enhance_prompt(self, prompt):
        """Улучшает промпт для лучших результатов"""
        # Добавляем стандартные улучшения
        enhancements = [
            "high quality",
            "detailed",
            "4k",
            "sharp focus"
        ]
        
        # Проверяем наличие художественного стиля
        if not any(style in prompt.lower() for style in ["painting", "digital art", "photo"]):
            enhancements.append("digital art")
            
        return f"{prompt}, {', '.join(enhancements)}"
        
    def suggest_templates(self, prompt, limit=5):
        """Предлагает похожие шаблоны"""
        words = set(re.findall(r'\w+', prompt.lower()))
        
        return PromptTemplate.objects.filter(
            Q(is_public=True) | Q(user=self.request.user)
        ).extra(
            select={'relevance': 'similarity(prompt, %s)'},
            select_params=(prompt,)
        ).order_by('-relevance')[:limit] 