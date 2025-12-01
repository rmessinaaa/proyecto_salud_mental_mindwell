from rest_framework import serializers
from django.contrib.auth.models import User
# Asegúrate de importar tu modelo correctamente
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
    # ✅ CORRECCIÓN 1: Quitamos read_only=True y ponemos required=False
    # Esto permite que el serializer ACEPTE estos campos cuando llegan desde React Native
    username = serializers.CharField(source='usuario.username', required=False)
    email = serializers.CharField(source='usuario.email', required=False)
    
    experiencia_siguiente_nivel = serializers.ReadOnlyField()

    class Meta:
        model = PerfilUsuario 
        fields = '__all__'
        # Asegúrate de que 'usuario' siga siendo solo lectura para no romper la relación
        read_only_fields = ['usuario', 'nivel_actual', 'experiencia_actual']

    # ✅ CORRECCIÓN 2: Sobrescribimos el método update con validaciones acumulativas
    def update(self, instance, validated_data):
        # 1. Extraemos los datos del usuario si vienen en la petición
        usuario_data = validated_data.pop('usuario', {})
        
        # Diccionario para acumular errores (permitiendo reportar ambos fallos a la vez)
        errors = {}

        # --- VALIDACIÓN MANUAL DE DUPLICADOS ---
        
        # Validación de Username
        if 'username' in usuario_data:
            nuevo_username = usuario_data['username']
            # Verificamos si existe en otro usuario distinto al actual
            if User.objects.filter(username=nuevo_username).exclude(pk=instance.usuario.pk).exists():
                errors['username'] = ["Ese usuario ya existe."]

        # Validación de Email
        if 'email' in usuario_data:
            nuevo_email = usuario_data['email']
            # Verificamos si existe en otro usuario distinto al actual
            if User.objects.filter(email=nuevo_email).exclude(pk=instance.usuario.pk).exists():
                errors['email'] = ["Ese correo ya está registrado."]
        
        # Si acumulamos algún error, lanzamos la excepción con todos ellos
        if errors:
            raise serializers.ValidationError(errors)
            
        # ---------------------------------------

        # 2. Actualizamos los campos propios del Perfil (ej: biografía)
        instance.biografia = validated_data.get('biografia', instance.biografia)
        instance.save()

        # 3. Actualizamos los datos del modelo User relacionado
        user = instance.usuario
        
        # Si venía un username nuevo y pasó la validación, lo guardamos
        if 'username' in usuario_data:
            user.username = usuario_data['username']
            
        # Si venía un email nuevo y pasó la validación, lo guardamos
        if 'email' in usuario_data:
            user.email = usuario_data['email']
            
        user.save()

        return instance