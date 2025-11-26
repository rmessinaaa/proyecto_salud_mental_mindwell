from rest_framework import serializers
from django.contrib.auth.models import User
# ✅ CAMBIO 1: Importar PerfilUsuario en lugar de Perfil
from .models import PerfilUsuario 

class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class PerfilSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='usuario.username', read_only=True)
    email = serializers.CharField(source='usuario.email', read_only=True)
    experiencia_siguiente_nivel = serializers.ReadOnlyField() # Para que el frontend lo lea

    class Meta:
        # ✅ CAMBIO 2: Usar PerfilUsuario aquí también
        model = PerfilUsuario 
        fields = '__all__'
        read_only_fields = ['usuario', 'nivel_actual', 'experiencia_actual']