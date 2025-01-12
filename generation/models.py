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
    original_prompt = models.TextField()  # Оригинальный промт
    prompt = models.TextField()  # Переведенный промт
    model = models.CharField(max_length=100, default='stable-diffusion-v1-5')
    style = models.CharField(max_length=100, default='base')
    color_scheme = models.CharField(max_length=100, default='none')
    n_steps = models.IntegerField(default=20)
    guidance_scale = models.FloatField(default=7.5)
    seed = models.IntegerField(null=True, blank=True)
    generated_image = models.ImageField(
        upload_to='generated/',
        validators=[validate_image]
    )
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    width = models.IntegerField(default=512)
    height = models.IntegerField(default=512)
    negative_prompt = models.TextField(blank=True)
    sampler = models.CharField(max_length=50, default="DPM++ 2M Karras")
    clip_skip = models.IntegerField(default=1)
    tiling = models.BooleanField(default=False)
    hires_fix = models.BooleanField(default=False)
    denoising_strength = models.FloatField(default=0.7)
    safety_checker = models.BooleanField(default=True)
    tags = models.ManyToManyField('ImageTag', blank=True)
    favorites = models.ManyToManyField(User, related_name='favorite_images', blank=True)

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

class PromptTemplate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prompt_templates')
    name = models.CharField(max_length=100)
    prompt = models.TextField()
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, default='general')
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    safety_checker = models.BooleanField(default=True) # Проверка на безопасность
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

class ImageCollection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

class SharedImage(models.Model):
    image = models.ForeignKey(ImageGenerationRequest, on_delete=models.CASCADE)
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE)
    can_edit = models.BooleanField(default=False)
    shared_at = models.DateTimeField(auto_now_add=True)

class ImageTag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class ImageRating(models.Model):
    image = models.ForeignKey(ImageGenerationRequest, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['image', 'user']

class ImageComment(models.Model):
    image = models.ForeignKey(ImageGenerationRequest, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
