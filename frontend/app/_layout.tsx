import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from '../hooks/use-color-scheme';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <Stack initialRouteName="index"> 
        {/* 1. Pantalla de carga inicial (Check Session) */}
        <Stack.Screen name="index" options={{ headerShown: false }} /> 

        {/* 2. Autenticación */}
        <Stack.Screen name="login" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        
        {/* 3. App Principal (Tabs) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />

        {/* 4. Pantallas Secundarias */}
        <Stack.Screen name="achievements" options={{ title: 'Logros' }} />
        <Stack.Screen name="calendar" options={{ title: 'Calendario' }} />
        <Stack.Screen name="charts" options={{ title: 'Gráficos' }} />
        <Stack.Screen name="community" options={{ title: 'Comunidad' }} />
        
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}