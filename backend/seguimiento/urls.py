from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegistroDiarioViewSet, DashboardStatsView, RecordatorioViewSet # <--- Importamos la nueva View

router = DefaultRouter()

# Rutas existentes
router.register(r'diario', RegistroDiarioViewSet, basename='registrodiario')

# ✅ NUEVA RUTA: Genera /api/seguimiento/recordatorios/
router.register(r'recordatorios', RecordatorioViewSet, basename='recordatorio')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]