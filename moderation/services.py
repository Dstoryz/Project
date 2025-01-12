from django.utils import timezone
from .models import ContentReport
from generation.models import ImageGenerationRequest
from django.core.files.storage import default_storage
import tensorflow as tf
import numpy as np

class ModerationService:
    def __init__(self):
        self.nsfw_model = self._load_nsfw_model()
        
    def create_report(self, reporter, image, report_type, description):
        return ContentReport.objects.create(
            reporter=reporter,
            image=image,
            report_type=report_type,
            description=description
        )
    
    def review_report(self, report_id, action, moderator_notes=None):
        report = ContentReport.objects.get(id=report_id)
        report.status = action
        report.resolved_at = timezone.now()
        report.save()
        
        if action == 'approved':
            self._handle_violation(report.image)
    
    def _handle_violation(self, image):
        # Блокируем изображение
        image.is_blocked = True
        image.save()
        
        # Уведомляем пользователя
        NotificationService().notify_content_violation(image.user, image) 
    
    def auto_moderate_image(self, image_request):
        if not image_request.safety_checker:
            return self._check_image_content(image_request)
        return True
    
    def _check_image_content(self, image_request):
        try:
            image_path = image_request.generated_image.path
            image = tf.keras.preprocessing.image.load_img(
                image_path, 
                target_size=(299, 299)
            )
            image_array = tf.keras.preprocessing.image.img_to_array(image)
            image_array = tf.keras.applications.inception_v3.preprocess_input(image_array)
            
            prediction = self.nsfw_model.predict(np.expand_dims(image_array, axis=0))
            nsfw_score = prediction[0][0]
            
            if nsfw_score > 0.8:  # Высокая вероятность NSFW контента
                self._handle_violation(image_request)
                return False
                
            return True
            
        except Exception as e:
            logger.error(f"Error in auto moderation: {e}")
            return True  # В случае ошибки пропускаем изображение
    
    def _load_nsfw_model(self):
        # Загрузка предобученной модели для определения NSFW контента
        # Здесь нужно реализовать загрузку вашей модели
        pass 