from django.urls import path
from .views import (
    ImageGenerationRequestView,
    HistoryView,
    GetCSRFToken,
    LoginView
)

app_name = 'generation'

urlpatterns = [
    path('generate/', ImageGenerationRequestView.as_view(), name='generate'),
    path('history/', HistoryView.as_view(), name='history'),
    path('history/<int:pk>/', HistoryView.as_view(), name='history-detail'),
    path('csrf/', GetCSRFToken.as_view(), name='get-csrf-token'),
    path('login/', LoginView.as_view(), name='login'),
]

