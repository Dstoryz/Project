# generation/admin.py

from django.contrib import admin
from .models import ImageGenerationRequest

@admin.register(ImageGenerationRequest)
class ImageGenerationRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'prompt', 'created_at', 'generated_image')
    search_fields = ('prompt', 'user__username', 'user__email')
    list_filter = ('created_at',)
    ordering = ('-created_at',)