# generation/models.py
from django.db import models
from django.contrib.auth.models import User  # Импорт модели User
from django.core.files.base import ContentFile
from PIL import Image
from io import BytesIO
import os
import logging
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)

def validate_image(image):
    if image.size > 10 * 1024 * 1024:  # 10MB
        raise ValidationError('Image size cannot exceed 10MB')
    if not image.name.lower().endswith(('.png', '.jpg', '.jpeg')):
        raise ValidationError('Unsupported file format')

class ImageGenerationRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prompt = models.TextField()
    model = models.CharField(max_length=100, default='stable-diffusion-v1-5')
    style = models.CharField(max_length=100, default='base')
    n_steps = models.IntegerField(default=20)
    guidance_scale = models.FloatField(default=7.5)
    seed = models.IntegerField(null=True, blank=True)
    generated_image = models.ImageField(
        upload_to='generated/',
        validators=[validate_image]
    )
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.prompt

    def create_thumbnail(self):
        if not self.generated_image:
            return

        try:
            image = Image.open(self.generated_image)
            image.thumbnail((256, 256), Image.Resampling.LANCZOS)
            
            thumb_io = BytesIO()
            image.save(thumb_io, format='JPEG', quality=85)
            
            thumb_filename = f'thumb_{os.path.basename(self.generated_image.name)}'
            self.thumbnail.save(thumb_filename, ContentFile(thumb_io.getvalue()), save=False)
        except Exception as e:
            print(f"Error creating thumbnail: {e}")

    def save(self, *args, **kwargs):
        if not self.thumbnail:
            self.create_thumbnail()
        super().save(*args, **kwargs)
