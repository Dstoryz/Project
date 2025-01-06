from django.urls import path
from .views import ImageGenerationRequestView, HistoryView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('generate/', ImageGenerationRequestView.as_view(), name='generate-image'),
    path('history/', HistoryView.as_view(), name='history-list'),
    path('history/<int:pk>/', HistoryView.as_view(), name='history-detail'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

