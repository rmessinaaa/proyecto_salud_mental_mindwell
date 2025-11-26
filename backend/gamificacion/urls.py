from django.urls import path
from .views import ListaLogrosView, RegistrarAccionView

urlpatterns = [
    path('logros/', ListaLogrosView.as_view()),
    path('accion/', RegistrarAccionView.as_view()), # Nueva ruta
]