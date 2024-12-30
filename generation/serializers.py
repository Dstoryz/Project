# generation/serializers.py
from rest_framework import serializers
from .models import ImageGenerationRequest
import logging

logger = logging.getLogger(__name__)

class ImageGenerationRequestSerializer(serializers.ModelSerializer):
    generated_image = serializers.ImageField(read_only=True)

    # Дополнительные параметры запроса
    # n_steps = serializers.IntegerField(
    #     required=False,
    #     default=300,
    #     min_value=50,
    #     max_value=1000
    # )

    guidance_scale = serializers.FloatField(
        required=False,
        default=9.5,
        min_value=0.0,
        max_value=20.0
    )

    class Meta:
        model = ImageGenerationRequest
        fields = [
            'prompt', 'created_at', 'generated_image',
            'guidance_scale'
        ]
        read_only_fields = ['created_at', 'generated_image']  # Указываем поля, которые нельзя менять

    def create(self, validated_data):
        # Проверка на наличие пользователя в запросе
        logger.debug("Validated data: %s", validated_data)
        validated_data.pop('user', None)
        user = self.context['request'].user
        if not user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated.")

        # Убираем дополнительные параметры из validated_data
        n_steps = validated_data.pop('n_steps', 75)
        # high_noise_frac = validated_data.pop('high_noise_frac', 0.7)
        guidance_scale = validated_data.pop('guidance_scale', 9.5)
        logger.debug("Extracted n_steps: %s", n_steps)
        # Создаем запрос
        instance = ImageGenerationRequest.objects.create(user=user, **validated_data)

        # Добавляем параметры генерации
        instance.n_steps = n_steps
        # instance.high_noise_frac = high_noise_frac
        instance.guidance_scale = guidance_scale

        instance.save()

        return instance

    def validate_prompt(self, value):
        if not value.strip():
            raise serializers.ValidationError("Prompt cannot be empty.")
        return value