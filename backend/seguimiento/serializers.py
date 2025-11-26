from rest_framework import serializers
from .models import RegistroDiario, Recordatorio # <--- Importamos Recordatorio

class RegistroDiarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroDiario
        fields = '__all__'
        read_only_fields = ['usuario', 'fecha', 'hora']

# ✅ NUEVO SERIALIZER PARA CALENDARIO
class RecordatorioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recordatorio
        fields = '__all__'
        # 'usuario' se asigna automático, el resto se puede enviar desde el front
        read_only_fields = ['usuario']