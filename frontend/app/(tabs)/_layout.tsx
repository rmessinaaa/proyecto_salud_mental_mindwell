import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

// Iconos (usando Lucide como en el resto de tu app)
import { 
  LayoutDashboard, 
  Book, 
  Gamepad2, 
  Library, 
  Settings, 
  Heart 
} from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Ocultar la barra superior por defecto
        tabBarActiveTintColor: '#2563eb', // Color azul para el tab activo
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}>

      {/* PANTALLA INVISIBLE: Index (Redirección) */}
      <Tabs.Screen 
        name="index" 
        options={{ href: null }} // 'href: null' lo oculta de la barra de abajo
      />

      {/* 1. INICIO */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />

      {/* 2. DIARIO */}
      <Tabs.Screen
        name="diary"
        options={{
          title: 'Diario',
          tabBarIcon: ({ color }) => <Book size={24} color={color} />,
        }}
      />

      {/* 3. JUEGOS */}
      <Tabs.Screen
        name="game"
        options={{
          title: 'Juegos',
          tabBarIcon: ({ color }) => <Gamepad2 size={24} color={color} />,
        }}
      />

      {/* 4. RECURSOS */}
      <Tabs.Screen
        name="library"
        options={{
          title: 'Biblioteca',
          tabBarIcon: ({ color }) => <Library size={24} color={color} />,
        }}
      />

      {/* 5. BIENESTAR */}
      <Tabs.Screen
        name="wellness"
        options={{
          title: 'Bienestar',
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />

      {/* 6. AJUSTES */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />

    </Tabs>
  );
}