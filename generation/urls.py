from django.urls import path
from .views import ImageGenerationRequestView
from .views import HistoryView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('history/', HistoryView.as_view(), name='history'),
    path('generate/', ImageGenerationRequestView.as_view(), name='image-generation'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

