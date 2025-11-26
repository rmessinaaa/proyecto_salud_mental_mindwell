from django.urls import path
from .views import RegistroView, LoginView, PerfilView

urlpatterns = [
    path('registro/', RegistroView.as_view()),
    path('login/', LoginView.as_view()),
    path('perfil/', PerfilView.as_view()),
]