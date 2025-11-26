from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.db.models import Count, Avg
from collections import Counter

# Importamos Modelos y Serializers
from .models import RegistroDiario, Recordatorio 
from .serializers import RegistroDiarioSerializer, RecordatorioSerializer

# 1. CRUD DEL DIARIO (Historial)
class RegistroDiarioViewSet(viewsets.ModelViewSet):
    serializer_class = RegistroDiarioSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RegistroDiario.objects.filter(usuario=self.request.user).order_by('-fecha', '-hora')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

# 2. CRUD DE RECORDATORIOS (Calendario - Nuevo) ✅
class RecordatorioViewSet(viewsets.ModelViewSet):
    serializer_class = RecordatorioSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtramos por usuario y ordenamos por fecha (los más próximos primero)
        return Recordatorio.objects.filter(usuario=self.request.user).order_by('fecha_hora')

    def perform_create(self, serializer):
        # Asigna el usuario logueado automáticamente
        serializer.save(usuario=self.request.user)

# 3. VISTA DE ESTADÍSTICAS
class DashboardStatsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        registros = RegistroDiario.objects.filter(usuario=request.user)
        total_count = registros.count() or 1
        
        # --- A. PIE CHART ---
        emociones_raw = registros.values('emocion').annotate(total=Count('emocion'))
        colores = {
            'feliz': '#16a34a', 'contento': '#84cc16', 'neutral': '#94a3b8',
            'triste': '#3b82f6', 'ansioso': '#f97316', 'enojado': '#ef4444'
        }
        pie_data = []
        for item in emociones_raw:
            nombre = item['emocion']
            pie_data.append({
                "value": round((item['total'] / total_count) * 100),
                "count": item['total'],
                "color": colores.get(nombre, '#cccccc'),
                "text": f"{round((item['total'] / total_count) * 100)}%",
                "label": nombre.capitalize()
            })

        # --- B. LINE CHART ---
        ultimos_7 = registros.order_by('-fecha')[:7]
        ultimos_7 = reversed(ultimos_7) 
        dias_semana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
        line_mood = []
        line_energy = []
        for r in ultimos_7:
            dia = dias_semana[r.fecha.weekday()]
            line_mood.append({"value": r.nivel_intensidad, "label": dia})
            line_energy.append({"value": r.nivel_energia})

        # --- C. BAR CHART ---
        all_activities = []
        for r in registros:
            if r.actividades:
                acts = [a.strip() for a in r.actividades.split(',') if a.strip()]
                all_activities.extend(acts)
        top_activities = Counter(all_activities).most_common(5)
        bar_data = []
        colores_barras = ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e']
        for i, (act, count) in enumerate(top_activities):
            bar_data.append({
                "value": count,
                "label": act[:4],
                "frontColor": colores_barras[i % len(colores_barras)]
            })

        # --- D. PROMEDIO ---
        promedio = registros.aggregate(Avg('nivel_intensidad'))['nivel_intensidad__avg'] or 0

        return Response({
            "pie_chart": pie_data,
            "line_mood": line_mood,
            "line_energy": line_energy,
            "bar_data": bar_data,
            "promedio_general": round(promedio, 1),
            "total_dias": registros.count()
        })