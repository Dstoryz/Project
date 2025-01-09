from django.core.management.base import BaseCommand
from generation.models import ImageGenerationRequest

class Command(BaseCommand):
    help = 'Generates thumbnails for existing images'

    def handle(self, *args, **kwargs):
        images = ImageGenerationRequest.objects.filter(thumbnail='')
        total = images.count()
        
        self.stdout.write(f'Found {total} images without thumbnails')
        
        for i, image in enumerate(images, 1):
            try:
                self.stdout.write(f'Processing image {i}/{total}...')
                image.create_thumbnail()
                image.save()
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error processing image {i}: {e}'))
            
        self.stdout.write(self.style.SUCCESS('Successfully generated all thumbnails')) 