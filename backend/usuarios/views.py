from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.authentication import TokenAuthentication

# ✅ CAMBIO 1: Importar PerfilUsuario
from .models import PerfilUsuario
from .serializers import RegistroSerializer, PerfilSerializer

# ... (RegistroView y LoginView se quedan igual) ...

class RegistroView(generics.CreateAPIView):
    serializer_class = RegistroSerializer

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'id': user.id})
        return Response({'error': 'Credenciales inválidas'}, status=400)

class PerfilView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # ✅ CAMBIO 2: Usar PerfilUsuario
        # Nota: Django usa 'perfilusuario' (todo minuscula) como nombre por defecto de la relacion inversa
        try:
            perfil = request.user.perfilusuario 
        except PerfilUsuario.DoesNotExist:
            perfil = PerfilUsuario.objects.create(usuario=request.user)
            
        serializer = PerfilSerializer(perfil)
        return Response(serializer.data)

    def patch(self, request):
        try:
            perfil = request.user.perfilusuario
        except PerfilUsuario.DoesNotExist:
            return Response({"error": "Perfil no encontrado"}, status=404)

        serializer = PerfilSerializer(perfil, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)