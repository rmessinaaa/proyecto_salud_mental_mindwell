from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # --- RUTAS DE LA API ---
    # Conectamos las URLs de cada aplicación individual
    
    # 1. Usuarios (Login, Registro, Perfil)
    # Ejemplo: /api/auth/login/
    path('api/auth/', include('usuarios.urls')),
    
    # 2. Seguimiento (Diario, Estadísticas)
    # Ejemplo: /api/seguimiento/diario/
    path('api/seguimiento/', include('seguimiento.urls')),
    
    # 3. Gamificación (Logros, Niveles)
    # Ejemplo: /api/gamificacion/logros/
    path('api/gamificacion/', include('gamificacion.urls')),
]