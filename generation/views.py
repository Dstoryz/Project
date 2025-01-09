# generation/views.py
import io
import logging
from random import randint
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.base import ContentFile
from diffusers import AutoPipelineForText2Image
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated, AllowAny
import torch
from .models import ImageGenerationRequest
from .serializers import ImageGenerationRequestSerializer
from .models_config import MODEL_CONFIG  # Импорт конфигурации
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken
from .services import TranslationService

logger = logging.getLogger(__name__)

# Добавляем класс GetCSRFToken
@method_decorator(ensure_csrf_cookie, name='dispatch') # CSRF отключён, убедитесь, что токен не требуется
class GetCSRFToken(View):
    permission_classes = []  # Разрешаем доступ без аутентификации
    
    def get(self, request):
        return JsonResponse({'detail': 'CSRF cookie set'})

@method_decorator(ensure_csrf_cookie, name='dispatch')
class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user is not None:
            login(request, user)
            return Response({'detail': 'Successfully logged in'})
        else:
            return Response(
                {'detail': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

@method_decorator(csrf_exempt, name='dispatch')
class ImageGenerationRequestView(APIView):
    permission_classes = [IsAuthenticated]
    translation_service = TranslationService()

    @swagger_auto_schema(request_body=ImageGenerationRequestSerializer)
    def post(self, request):
        """
        Обрабатывает запрос на генерацию изображения.
        """
        # Логируем все параметры запроса
        logger.info("Received generation request with parameters:")

        logger.info(f"Prompt: {request.data.get('prompt')}")
        logger.info(f"Model: {request.data.get('model')}")
        logger.info(f"Style: {request.data.get('style')}")
        logger.info(f"Steps: {request.data.get('n_steps')}")
        logger.info(f"Guidance Scale: {request.data.get('guidance_scale')}")
        logger.info(f"Seed: {request.data.get('seed')}")
        logger.info(f"Full request data: {request.data}")
        logger.info(f"Request received from user {request.user.id}")
        prompt = request.data.get('prompt')
        
        # Переводим промт на английский
        translated_prompt = self.translation_service.translate(prompt)
        
        logger.info(f"Original prompt: {prompt}")
        logger.info(f"Translated prompt: {translated_prompt}")
        
        # Используем переведенный промт для генерации
        serializer = ImageGenerationRequestSerializer(
            data={**request.data, 'prompt': translated_prompt},
            context={'request': request}
        )

        if serializer.is_valid():
            try:
                # Сохранение запроса
                image_request = serializer.save(
                    user=request.user,
                    original_prompt=prompt,
                    prompt=translated_prompt
                )

                # Извлечение параметров
                model_name = request.data.get("model", "stable-diffusion-v1-5")
                processed_prompt = process_prompt(
                    image_request.prompt,
                    style=request.data.get("style"),
                    color_scheme=request.data.get("colorScheme")
                )

                # Логируем обработанный промпт
                logger.info(f"Processed prompt: {processed_prompt}")

                # Извлечение количества шагов
                n_steps = request.data.get("n_steps", 75)
                logger.info(f"Using n_steps: {n_steps}")
                
                # Загрузка модели
                pipeline = self.load_model(model_name)

                # Генерация изображения
                generated_image_data = self.generate_image(
                    pipeline=pipeline,
                    prompt=processed_prompt,
                    n_steps=n_steps,
                    guidance_scale=request.data.get("guidance_scale", 7.5),
                    seed=request.data.get("seed"),
                    height=request.data.get("height"),
                    width=request.data.get("width")
                )

                # Сохранение изображения в модели
                image_request.generated_image.save(
                    f"{image_request.id}_image.png",
                    ContentFile(generated_image_data.getvalue()),
                    save=True
                )

                # Освобождение ресурсов
                del pipeline
                torch.cuda.empty_cache()

                logger.info("Image generation completed successfully")
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            except Exception as e:
                logger.error(f"Image generation failed: {str(e)}")
                return Response(
                    {"error": "Image generation failed", "details": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        logger.error(f"Invalid data received: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def load_model(self, model_name):
        """
        Загружает модель на основе имени из конфигурации.
        """
        model_config = MODEL_CONFIG.get(model_name)
        if not model_config:
            raise ValueError(f"Model '{model_name}' not found in configuration.")

        try:
            logger.info(f"Loading model: {model_name}")
            if "variant" in model_config:
                return AutoPipelineForText2Image.from_pretrained(
                    model_config["path"],
                    torch_dtype=model_config["torch_dtype"],
                    variant=model_config["variant"]
                ).to("cuda")
            else:
                return AutoPipelineForText2Image.from_pretrained(
                    model_config["path"],
                    torch_dtype=model_config["torch_dtype"]
                ).to("cuda")
        except Exception as e:
            logger.error(f"Failed to load model '{model_name}': {str(e)}")
            raise RuntimeError(f"Could not load model '{model_name}'.")

    def generate_image(self, pipeline, prompt, n_steps, guidance_scale=7.5, seed=None, height=512,width=512):
        """
        Генерирует изображение с помощью заданного пайплайна.
        """
        # Используем переданный seed или генерируем случайный
        if seed is None:
            seed = randint(0, 2 ** 32 - 1)
        
        generator = torch.Generator("cuda").manual_seed(seed)

        # Подробное логирование всех параметров генерации
        logger.info("=" * 50)
        logger.info("GENERATION PARAMETERS:")
        logger.info("=" * 50)
        logger.info(f"Model: {pipeline.__class__.__name__}")
        logger.info(f"Prompt: {prompt}")
        logger.info(f"Steps: {n_steps}")
        logger.info(f"Guidance Scale: {guidance_scale}")
        logger.info(f"Seed: {seed}")
        logger.info(f"Hight: {height}")
        logger.info(f"Width: {width}")
        logger.info("=" * 50)

        # Генерация изображения с полными параметрами
        image = pipeline(
            prompt=prompt,
            num_inference_steps=n_steps,
            guidance_scale=guidance_scale,
            generator=generator,
            height=height,
            width=width
        ).images[0]

        image_io = io.BytesIO()
        image.save(image_io, format="PNG")
        image_io.seek(0)
        return image_io

@method_decorator(ensure_csrf_cookie, name='dispatch')
class HistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            logger.info(f"Fetching history for user {request.user.id}")
            history = ImageGenerationRequest.objects.filter(
                user=request.user
            ).order_by('-created_at')
            
            logger.info(f"Found {history.count()} items")
            serializer = ImageGenerationRequestSerializer(history, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching history: {str(e)}")
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, pk=None):
        """
        Удаляет запись из истории.
        """
        try:
            item = ImageGenerationRequest.objects.get(id=pk, user=request.user)
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ImageGenerationRequest.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


def process_prompt(prompt, style=None, color_scheme=None):
    """
    Обрабатывает пользовательский промпт на основе переданных параметров,
    добавляя настройки в конец промпта через запятую.
    """
    settings = []
    if style:
        settings.append(f"{style.capitalize()} style")
    if color_scheme == 'vibrant':
        settings.append("vibrant color scheme")
    elif color_scheme == 'monochrome':
        settings.append("monochrome color scheme")
    elif color_scheme == 'pastel':
        settings.append("pastel colors")
    return f"{prompt}, {', '.join(settings)}" if settings else prompt
