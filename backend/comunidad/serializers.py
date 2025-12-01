from rest_framework import serializers
from .models import Publicacion

class PublicacionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='usuario.username', read_only=True)
    # Podríamos añadir avatar aquí si tuviéramos URL pública, por ahora usaremos iniciales en el front

    class Meta:
        model = Publicacion
        fields = ['id', 'username', 'contenido', 'fecha_creacion', 'likes']
        read_only_fields = ['id', 'fecha_creacion', 'likes']