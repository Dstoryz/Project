from .models import ImageCollection, SharedImage, ImageTag
from django.db.models import Count, Q
from django.core.exceptions import PermissionDenied

class CollectionService:
    def create_collection(self, user, name, description='', is_public=False, tags=None):
        collection = ImageCollection.objects.create(
            user=user,
            name=name,
            description=description,
            is_public=is_public
        )
        if tags:
            collection.tags.add(*tags)
        return collection
    
    def add_to_collection(self, collection, images, user):
        # Проверяем права доступа
        if not self.can_edit_collection(collection, user):
            raise PermissionDenied("No permission to edit this collection")
            
        collection.images.add(*images)
        
        # Автоматически добавляем теги из изображений
        for image in images:
            collection.tags.add(*image.tags.all())
    
    def remove_from_collection(self, collection, images, user):
        if not self.can_edit_collection(collection, user):
            raise PermissionDenied("No permission to edit this collection")
            
        collection.images.remove(*images)
        
        # Пересчитываем теги
        self._recalculate_collection_tags(collection)
    
    def can_edit_collection(self, collection, user):
        if collection.user == user:
            return True
        return SharedImage.objects.filter(
            image__in=collection.images.all(),
            shared_with=user,
            can_edit=True
        ).exists()
    
    def _recalculate_collection_tags(self, collection):
        # Получаем все теги из всех изображений в коллекции
        collection.tags.clear()
        collection.tags.add(*ImageTag.objects.filter(
            imagegenerationrequest__in=collection.images.all()
        ).distinct())
    
    def share_collection(self, collection, shared_with_user, can_edit=False):
        for image in collection.images.all():
            SharedImage.objects.create(
                image=image,
                shared_with=shared_with_user,
                can_edit=can_edit
            )
    
    def get_user_collections(self, user):
        return ImageCollection.objects.filter(user=user)
    
    def get_shared_collections(self, user):
        shared_images = SharedImage.objects.filter(shared_with=user)
        return ImageCollection.objects.filter(
            images__in=shared_images.values_list('image', flat=True)
        ).distinct() 