# Ejecutar con: python manage.py shell < simulacion.py
import random
import time
from django.contrib.auth.models import User
from django.db import transaction

print("--- 🚀 INICIANDO SIMULACIÓN DE CARGA ---")

nombres = ["Alex", "Beatriz", "Carlos", "Diana", "Eduardo", "Fernanda", "Gabriel", "Hilda"]
apellidos = ["Gomez", "Lopez", "Perez", "Ruiz", "Silva", "Vega", "Diaz", "Mora"]

creados = 0

# Creamos 15 usuarios simulados
for i in range(1, 16):
    nombre = random.choice(nombres)
    apellido = random.choice(apellidos)
    # Random int para evitar duplicados si corres el script varias veces
    username = f"{nombre.lower()}.{apellido.lower()}_{random.randint(1000, 9999)}"
    
    try:
        if not User.objects.filter(username=username).exists():
            # Crear usuario
            user = User.objects.create_user(
                username=username,
                email=f"{username}@test.com",
                password="Password123"
            )
            
            # Simular progreso en el juego (Nivel y Experiencia aleatoria)
            if hasattr(user, 'perfilusuario'):
                perfil = user.perfilusuario
                perfil.nivel_actual = random.randint(1, 10)
                perfil.experiencia_actual = random.randint(50, 5000)
                perfil.save()
            
            creados += 1
            print(f"[OK] {username} (Nivel {user.perfilusuario.nivel_actual})")
    except Exception as e:
        print(f"[ERROR] No se pudo crear {username}: {e}")

print(f"--- ✅ FIN: {creados} usuarios insertados ---")