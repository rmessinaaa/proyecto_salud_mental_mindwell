from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import PerfilUsuario

# Esto nos permite ver el Perfil (Nivel) dentro de la pantalla de Usuario
class PerfilInline(admin.StackedInline):
    model = PerfilUsuario
    can_delete = False
    verbose_name_plural = 'Perfil de Gamificación'

# Extendemos el admin de Usuario oficial
class UserAdmin(BaseUserAdmin):
    inlines = (PerfilInline,)
    list_display = ('username', 'email', 'get_nivel', 'is_staff')

    def get_nivel(self, instance):
        # Intentamos obtener el nivel si existe el perfil
        return instance.perfilusuario.nivel_actual if hasattr(instance, 'perfilusuario') else '-'
    get_nivel.short_description = 'Nivel de Juego'

# Re-registramos el usuario con nuestra configuración
admin.site.unregister(User)
admin.site.register(User, UserAdmin)