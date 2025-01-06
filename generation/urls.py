from django.urls import path
from .views import ImageGenerationRequestView, HistoryView, GetCSRFToken, LoginView

urlpatterns = [
    path('csrf/', GetCSRFToken.as_view(), name='csrf'),
    path('login/', LoginView.as_view(), name='login'),
    path('generate/', ImageGenerationRequestView.as_view(), name='generate'),
    path('generation/history/', HistoryView.as_view(), name='history'),
]

