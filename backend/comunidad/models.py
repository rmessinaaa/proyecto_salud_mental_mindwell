from django.db import models
from django.contrib.auth.models import User

class Publicacion(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='publicaciones')
    contenido = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)

    class Meta:
        ordering = ['-fecha_creacion'] # Los más nuevos primero

    def __str__(self):
        return f"{self.usuario.username}: {self.contenido[:20]}..."