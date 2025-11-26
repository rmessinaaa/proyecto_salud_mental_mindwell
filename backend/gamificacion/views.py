from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.authentication import TokenAuthentication

from .models import Logro, LogroUsuario
from .serializers import LogroSerializer
# Importamos el perfil correctamente ahora que ya arreglaste usuarios/models.py
from usuarios.models import PerfilUsuario 

# 1. VISTA PARA LISTAR LOGROS (Esta era la que faltaba)
class ListaLogrosView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # 1. Logros desbloqueados por el usuario
        desbloqueados_ids = LogroUsuario.objects.filter(usuario=request.user).values_list('logro_id', flat=True)
        
        # 2. Obtener objetos completos
        logros_desbloqueados = Logro.objects.filter(id__in=desbloqueados_ids)
        logros_bloqueados = Logro.objects.exclude(id__in=desbloqueados_ids)

        return Response({
            "desbloqueados": LogroSerializer(logros_desbloqueados, many=True).data,
            "bloqueados": LogroSerializer(logros_bloqueados, many=True).data,
            "puntos_totales": sum(l.puntos for l in logros_desbloqueados)
        })

# 2. VISTA PARA REGISTRAR ACCIONES Y GANAR XP
class RegistrarAccionView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        tipo_accion = request.data.get('tipo') 
        xp_ganada = request.data.get('xp', 10) 
        
        user = request.user
        
        # Obtenemos el perfil (asegurando compatibilidad con tu modelo nuevo)
        try:
            perfil = user.perfilusuario
        except PerfilUsuario.DoesNotExist:
            perfil = PerfilUsuario.objects.create(usuario=user)

        # 1. Sumar XP
        perfil.experiencia_actual += int(xp_ganada)
        
        # Lógica de subida de nivel
        if perfil.experiencia_actual >= (perfil.nivel_actual * 100):
            perfil.experiencia_actual -= (perfil.nivel_actual * 100)
            perfil.nivel_actual += 1
        
        perfil.save()

        # 2. Verificar Logros
        logros_desbloqueados = []
        
        if tipo_accion == 'recurso_completado':
            logro, _ = Logro.objects.get_or_create(
                nombre="Estudiante del bienestar", 
                defaults={'puntos': 50, 'descripcion': 'Completa un recurso', 'icono': '📚'}
            )
            if not LogroUsuario.objects.filter(usuario=user, logro=logro).exists():
                LogroUsuario.objects.create(usuario=user, logro=logro)
                logros_desbloqueados.append(logro.nombre)

        elif tipo_accion == 'mision_diaria':
            logro, _ = Logro.objects.get_or_create(
                nombre="Dedicado", 
                defaults={'puntos': 30, 'descripcion': 'Completa una misión', 'icono': '🎯'}
            )
            if not LogroUsuario.objects.filter(usuario=user, logro=logro).exists():
                LogroUsuario.objects.create(usuario=user, logro=logro)
                logros_desbloqueados.append(logro.nombre)

        return Response({
            "mensaje": "Acción registrada",
            "nuevo_nivel": perfil.nivel_actual,
            "nueva_xp": perfil.experiencia_actual,
            "logros_nuevos": logros_desbloqueados
        })