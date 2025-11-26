from django.db import models
from django.contrib.auth.models import User

class Logro(models.Model):
    RAREZAS = [('Común', 'Común'), ('Raro', 'Raro'), ('Épico', 'Épico'), ('Legendario', 'Legendario')]
    
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    icono = models.CharField(max_length=10, default="🏆") # Emoji o nombre de icono
    rareza = models.CharField(max_length=20, choices=RAREZAS, default='Común')
    puntos = models.IntegerField(default=10)
    es_secreto = models.BooleanField(default=False)
    pista = models.CharField(max_length=200, blank=True, null=True) # Solo si es secreto

    def __str__(self):
        return self.nombre

class LogroUsuario(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    logro = models.ForeignKey(Logro, on_delete=models.CASCADE)
    fecha_obtenido = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'logro') # No puedes ganar el mismo logro 2 veces