# generation/models.py
from django.db import models
from django.contrib.auth.models import User  # Импорт модели User

class ImageGenerationRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='image_requests')  # Связь с пользователем
    prompt = models.CharField(max_length=1500)
    created_at = models.DateTimeField(auto_now_add=True)
    generated_image = models.ImageField(upload_to='generated_images/', null=True, blank=True)

    def __str__(self):
        return self.prompt
