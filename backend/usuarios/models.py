from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# ✅ CAMBIO 1: Renombramos la clase de 'Perfil' a 'PerfilUsuario' para coincidir con la vista
class PerfilUsuario(models.Model):
    # Relación 1 a 1 con el usuario de Django
    # ✅ CAMBIO 2: Quitamos related_name='perfil' para que Django use el defecto 'perfilusuario'
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # Datos básicos
    biografia = models.TextField(blank=True, max_length=500)
    avatar_url = models.CharField(max_length=255, blank=True, null=True)
    
    # Configuraciones
    notificaciones_diarias = models.BooleanField(default=True)
    notificaciones_misiones = models.BooleanField(default=True)
    tema_oscuro = models.BooleanField(default=False)
    
    # Info de Gamificación
    nivel_actual = models.IntegerField(default=1)
    # ✅ CAMBIO 3: Agregamos experiencia_actual, ¡es vital para los juegos!
    experiencia_actual = models.IntegerField(default=0)
    es_premium = models.BooleanField(default=False)

    # ✅ CAMBIO 4: Propiedad para que el Frontend sepa cuánto falta para subir de nivel
    @property
    def experiencia_siguiente_nivel(self):
        return self.nivel_actual * 100

    def __str__(self):
        return f"Perfil de {self.usuario.username}"

# --- SEÑALES ---
@receiver(post_save, sender=User)
def crear_perfil_usuario(sender, instance, created, **kwargs):
    if created:
        PerfilUsuario.objects.create(usuario=instance)

@receiver(post_save, sender=User)
def guardar_perfil_usuario(sender, instance, **kwargs):
    # Verificamos que tenga perfil antes de guardar
    if hasattr(instance, 'perfilusuario'):
        instance.perfilusuario.save()