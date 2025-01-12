from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageFont
import io
from django.core.files.base import ContentFile
import numpy as np
from django.conf import settings
import os
import logging

logger = logging.getLogger(__name__)

class ImageService:
    def __init__(self):
        self.supported_formats = ['JPEG', 'PNG', 'WEBP']
        self.max_image_size = 10 * 1024 * 1024  # 10MB
        
    def process_image(self, image_file, operations=None):
        """Обрабатывает изображение с указанными операциями"""
        try:
            image = Image.open(image_file)
            
            if operations:
                for op in operations:
                    if op['type'] == 'resize':
                        image = self._resize_image(image, **op['params'])
                    elif op['type'] == 'filter':
                        image = self._apply_filter(image, **op['params'])
                    elif op['type'] == 'watermark':
                        image = self._add_watermark(image, **op['params'])
                        
            # Оптимизируем результат
            output = io.BytesIO()
            image.save(output, format='JPEG', quality=85, optimize=True)
            return ContentFile(output.getvalue())
            
        except Exception as e:
            logger.error(f"Error processing image: {e}")
            raise
            
    def _resize_image(self, image, width=None, height=None, method='lanczos'):
        """Изменяет размер изображения"""
        if width and height:
            size = (width, height)
        elif width:
            ratio = width / image.width
            size = (width, int(image.height * ratio))
        elif height:
            ratio = height / image.height
            size = (int(image.width * ratio), height)
        else:
            return image
            
        return image.resize(size, getattr(Image.Resampling, method.upper())) 

    def _apply_filter(self, image, filter_type, strength=1.0):
        """Применяет фильтры к изображению"""
        if filter_type == 'sharpen':
            enhancer = ImageEnhance.Sharpness(image)
            return enhancer.enhance(strength)
        elif filter_type == 'blur':
            return image.filter(ImageFilter.GaussianBlur(radius=strength))
        elif filter_type == 'contrast':
            enhancer = ImageEnhance.Contrast(image)
            return enhancer.enhance(strength)
        return image

    def _add_watermark(self, image, text, position='bottom', opacity=0.5):
        """Добавляет водяной знак"""
        txt = Image.new('RGBA', image.size, (255, 255, 255, 0))
        draw = ImageDraw.Draw(txt)
        
        # Расчет размера шрифта относительно изображения
        font_size = int(min(image.size) * 0.05)
        font = ImageFont.truetype(
            os.path.join(settings.STATIC_ROOT, 'fonts/OpenSans-Regular.ttf'),
            size=font_size
        )
        
        # Позиционирование текста
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        
        if position == 'bottom':
            x = (image.width - text_width) / 2
            y = image.height - text_height - font_size
        elif position == 'center':
            x = (image.width - text_width) / 2
            y = (image.height - text_height) / 2
            
        draw.text((x, y), text, font=font, fill=(255, 255, 255, int(255 * opacity)))
        return Image.alpha_composite(image.convert('RGBA'), txt)

    def convert_format(self, image_file, target_format):
        """Конвертирует изображение в другой формат"""
        if target_format not in self.supported_formats:
            raise ValueError(f"Unsupported format: {target_format}")
            
        image = Image.open(image_file)
        output = io.BytesIO()
        
        if target_format == 'JPEG' and image.mode in ('RGBA', 'P'):
            image = image.convert('RGB')
            
        image.save(output, format=target_format, quality=85, optimize=True)
        return ContentFile(output.getvalue())

    def validate_image(self, image_file):
        """Проверяет изображение на соответствие требованиям"""
        try:
            image = Image.open(image_file)
            
            # Проверка размера файла
            if image_file.size > self.max_image_size:
                return False, "Image size exceeds maximum allowed"
                
            # Проверка формата
            if image.format not in self.supported_formats:
                return False, f"Unsupported image format: {image.format}"
                
            # Проверка размеров
            if any(dim > 8192 for dim in image.size):
                return False, "Image dimensions too large"
                
            return True, None
            
        except Exception as e:
            logger.error(f"Image validation error: {e}")
            return False, "Invalid image file" 