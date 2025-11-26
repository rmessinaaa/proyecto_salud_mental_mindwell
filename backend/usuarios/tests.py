from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User

class PruebasIntegracionUsuarios(APITestCase):
    
    def setUp(self):
        # Datos iniciales para las pruebas
        self.user_data = {
            'username': 'usuario_test_qa',
            'email': 'qa@mindwell.com',
            'password': 'Password123'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_login_exitoso_retorna_token(self):
        """
        Valida que al enviar credenciales correctas, el servidor 
        responde con 200 OK y un Token de acceso.
        """
        # --- CORRECCIÓN FINAL ---
        # Basado en tu archivo urls.py principal:
        # path('api/auth/', include('usuarios.urls'))
        # Entonces la ruta completa es:
        url = '/api/auth/login/' 
        
        data = {
            'username': 'usuario_test_qa',
            'password': 'Password123'
        }
        
        response = self.client.post(url, data, format='json')
        
        # Validaciones
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_perfil_creado_automaticamente(self):
        """
        Valida que el sistema crea automáticamente el perfil de juego
        cuando se registra un usuario (Signal).
        """
        self.assertTrue(hasattr(self.user, 'perfilusuario'))
        self.assertEqual(self.user.perfilusuario.nivel_actual, 1)