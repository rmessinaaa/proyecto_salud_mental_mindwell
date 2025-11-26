from rest_framework import serializers
from .models import Logro, LogroUsuario

class LogroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logro
        fields = '__all__'

class LogroUsuarioSerializer(serializers.ModelSerializer):
    logro = LogroSerializer(read_only=True)
    
    class Meta:
        model = LogroUsuario
        fields = ['logro', 'fecha_obtenido']