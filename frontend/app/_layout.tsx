import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from '../hooks/use-color-scheme'; // Asegúrate que la ruta del hook sea correcta
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <Stack>
        {/* 1. Layout principal de pestañas (La carpeta (tabs)) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* 2. Pantallas sueltas (fuera de las pestañas) */}
        <Stack.Screen name="index" options={{ headerShown: false }} /> 
        <Stack.Screen name="login" options={{ title: 'Iniciar sesión', headerShown: false }} />
        <Stack.Screen name="register" options={{ title: 'Registrarse', headerShown: false }} />
        
        {/* 3. Otras pantallas secundarias (si las usas) */}
        <Stack.Screen name="achievements" options={{ title: 'Logros' }} />
        <Stack.Screen name="calendar" options={{ title: 'Calendario' }} />
        <Stack.Screen name="charts" options={{ title: 'Gráficos' }} />
        <Stack.Screen name="community" options={{ title: 'Comunidad' }} />

        {/* 4. Ruta comodín para manejar errores 404 (opcional) */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}