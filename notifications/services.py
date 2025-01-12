from django.utils import timezone
from .models import Notification

class NotificationService:
    def create_notification(self, user, type, title, message):
        return Notification.objects.create(
            user=user,
            type=type,
            title=title,
            message=message
        )
    
    def notify_generation_complete(self, user, image):
        return self.create_notification(
            user=user,
            type='generation_complete',
            title='Image Generation Complete',
            message=f'Your image "{image.prompt[:50]}..." has been generated'
        )
    
    def notify_achievement_earned(self, user, achievement):
        return self.create_notification(
            user=user,
            type='achievement_earned',
            title='New Achievement Unlocked!',
            message=f'You earned the "{achievement.name}" achievement!'
        ) 