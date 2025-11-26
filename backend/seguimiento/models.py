from django.db import models
from django.contrib.auth.models import User

# 1. MODELO PARA EL HISTORIAL (LO QUE YA HICISTE)
class RegistroDiario(models.Model):
    EMOCIONES = [
        ('feliz', 'Feliz'),
        ('contento', 'Contento'),
        ('neutral', 'Neutral'),
        ('triste', 'Triste'),
        ('ansioso', 'Ansioso'),
        ('enojado', 'Enojado'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='registros')
    
    # Fecha y Hora automáticas (porque es un registro al momento)
    fecha = models.DateField(auto_now_add=True)
    hora = models.TimeField(auto_now_add=True)
    
    emocion = models.CharField(max_length=20, choices=EMOCIONES)
    nivel_intensidad = models.IntegerField(default=5)
    nivel_energia = models.IntegerField(default=5)
    
    nota = models.TextField(blank=True, null=True)
    actividades = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.usuario.username} - {self.fecha} - {self.emocion}"


# 2. NUEVO MODELO PARA EL CALENDARIO (LO QUE VAS A HACER)
class Recordatorio(models.Model):
    TIPOS = [
        ('meditacion', 'Meditación'),
        ('respiracion', 'Respiración'),
        ('sueño', 'Sueño'),
        ('diario', 'Diario'),
        ('otro', 'Otro'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recordatorios')
    
    # Datos del evento
    titulo = models.CharField(max_length=100) # Ej: "Meditación matutina"
    
    # Importante: DateTimeField normal (NO auto_now) para poder agendar a futuro
    fecha_hora = models.DateTimeField() 
    
    tipo = models.CharField(max_length=20, choices=TIPOS, default='otro')
    duracion = models.CharField(max_length=20, blank=True, help_text="Ej: 10 min")
    
    # Estado
    completado = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.titulo} - {self.fecha_hora.strftime('%d/%m %H:%M')}"