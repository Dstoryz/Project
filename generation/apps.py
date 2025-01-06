from django.apps import AppConfig
import os
from django.conf import settings


class GenerationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'generation'

    def ready(self):
        # Создаем директории при запуске приложения
        media_root = settings.MEDIA_ROOT
        os.makedirs(os.path.join(media_root, 'generated'), exist_ok=True)
        os.makedirs(os.path.join(media_root, 'thumbnails'), exist_ok=True)
