# Usamos una imagen ligera de Python oficial
FROM python:3.10-slim

# Evita que Python genere archivos .pyc y fuerza los logs a la consola (útil para monitoreo)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalamos dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiamos los requisitos e instalamos
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copiamos el resto del código del proyecto
COPY . /app/

# Exponemos el puerto 8000
EXPOSE 8000

# Comando para iniciar el servidor (Usamos Gunicorn para simular producción, o runserver para dev)
# Para este paso inicial usaremos runserver para verificar que arranca fácil
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]