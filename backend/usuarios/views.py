from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.authentication import TokenAuthentication

from .models import PerfilUsuario
from .serializers import RegistroSerializer, PerfilSerializer

# ==========================================
# 1. VISTA DE REGISTRO
# ==========================================
class RegistroView(generics.CreateAPIView):
    queryset = PerfilUsuario.objects.all() # Agregado para evitar warnings de DRF
    serializer_class = RegistroSerializer
    # ✅ CORRECCIÓN CRÍTICA: Permitir acceso a cualquiera (público)
    permission_classes = [permissions.AllowAny]

# ==========================================
# 2. VISTA DE LOGIN
# ==========================================
class LoginView(APIView):
    # ✅ CORRECCIÓN CRÍTICA: Permitir acceso a cualquiera (público)
    # Si no pones esto, settings.py bloquea el intento de login
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'id': user.id})
        return Response({'error': 'Credenciales inválidas'}, status=400)

# ==========================================
# 3. VISTA DE PERFIL
# ==========================================
class PerfilView(APIView):
    # Aquí SÍ queremos seguridad
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            # Intentamos obtener el perfil, si no existe, lo creamos
            perfil = request.user.perfilusuario 
        except PerfilUsuario.DoesNotExist:
            perfil = PerfilUsuario.objects.create(usuario=request.user)
            
        serializer = PerfilSerializer(perfil)
        return Response(serializer.data)

    def patch(self, request):
        try:
            perfil = request.user.perfilusuario
        except PerfilUsuario.DoesNotExist:
            perfil = PerfilUsuario.objects.create(usuario=request.user)

        serializer = PerfilSerializer(perfil, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)