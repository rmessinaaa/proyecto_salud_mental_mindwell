import time
import logging

# Configuramos un logger específico para monitoreo
logger = logging.getLogger('django.server')

class PerformanceMonitorMiddleware:
    """
    Middleware para medir y registrar el tiempo de respuesta de cada solicitud.
    Cumple con el requisito de monitoreo de desempeño.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 1. Registrar tiempo inicial
        start_time = time.time()

        # 2. Procesar la solicitud
        response = self.get_response(request)

        # 3. Calcular duración
        duration = time.time() - start_time
        
        # 4. Obtener metadatos
        path = request.path
        method = request.method
        status_code = response.status_code
        
        # 5. Generar Log de desempeño
        # Si tarda más de 0.5 segundos, lo marcamos como LENTO (WARNING)
        if duration > 0.5:
            logger.warning(f"[ALERTA DESEMPEÑO] LENTO: {method} {path} - {duration:.4f}s")
        else:
            logger.info(f"[MONITOREO] {method} {path} - {status_code} - {duration:.4f}s")

        return response