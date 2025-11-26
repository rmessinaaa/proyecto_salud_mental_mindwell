import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // 1. Buscar token en almacenamiento local
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        // No hay token -> Al Login
        console.log("No token found, redirecting to login...");
        router.replace('/login');
        return;
      }

      // 2. (Opcional pero recomendado) Validar si el token sigue vivo
      // Intentamos obtener el perfil. Si falla (401), el token no sirve.
      const perfil = await api.getPerfil();
      
      if (perfil) {
        // Token válido -> Al Dashboard
        console.log("Token valid, redirecting to dashboard...");
        router.replace('/(tabs)/dashboard');
      } else {
        // Token inválido/expirado -> Al Login
        console.log("Token invalid, redirecting to login...");
        await AsyncStorage.removeItem('userToken'); // Limpiamos basura
        router.replace('/login');
      }

    } catch (e) {
      // Error desconocido -> Por seguridad al Login
      console.error("Session check error:", e);
      router.replace('/login');
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Puedes poner tu logo aquí */}
      <ActivityIndicator size="large" color="#a855f7" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});