from rest_framework import generics, permissions
from .models import Publicacion
from .serializers import PublicacionSerializer

class PublicacionListCreateView(generics.ListCreateAPIView):
    queryset = Publicacion.objects.all()
    serializer_class = PublicacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Asigna automáticamente el usuario logueado al crear el post
        serializer.save(usuario=self.request.user)