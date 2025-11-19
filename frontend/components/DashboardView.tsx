import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

import {
  Book,
  TrendingUp,
  Gamepad2,
  Trophy,
  Library,
  Users,
  Heart,
  Calendar,
} from "lucide-react-native";

// ==========================================
// COMPONENTES AUXILIARES
// ==========================================

// Botón reutilizable
function Button({ children, onPress, variant = "solid" }: any) {
  const isOutline = variant === "outline";
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.buttonBase,
        isOutline ? styles.buttonOutline : styles.buttonSolid,
      ]}
    >
      <Text style={isOutline ? styles.textOutline : styles.textSolid}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export default function DashboardView() {
  // Navegación
  const go = (path: string) => {
    // Asegúrate que esta ruta coincida con tus archivos en app/(tabs)
    router.push(`/(tabs)/${path}` as any);
  };

  // Lista de acciones con colores convertidos a Hex
  const quickActions = [
    { icon: Book, label: "Diario", color: "#ec4899", path: "diary" },       // Pink-500
    { icon: TrendingUp, label: "Gráficos", color: "#22c55e", path: "charts" }, // Green-500
    { icon: Gamepad2, label: "Juegos", color: "#f97316", path: "game" },     // Orange-500
    { icon: Trophy, label: "Logros", color: "#eab308", path: "achievements" }, // Yellow-500
    { icon: Library, label: "Recursos", color: "#6366f1", path: "library" },  // Indigo-500
    { icon: Users, label: "Comunidad", color: "#14b8a6", path: "community" }, // Teal-500
    { icon: Heart, label: "Bienestar", color: "#f43f5e", path: "wellness" }, // Rose-500 (Nota: cambié 'wellbeing' a 'wellness' si así se llama tu archivo)
    { icon: Calendar, label: "Calendario", color: "#06b6d4", path: "calendar" }, // Cyan-500
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerSpace}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingText}>¡Hola, María! 👋</Text>
            <Text style={styles.dateText}>Martes, 11 de Noviembre de 2025</Text>
          </View>

          {/* Botón de Ajustes */}
          <Button variant="outline" onPress={() => go("settings")}>
            ⚙️ Ajustes
          </Button>
        </View>

        {/* CUADRÍCULA DE ACCIONES */}
        <View style={styles.gridContainer}>
          {quickActions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => go(item.path)}
              style={styles.card}
            >
              {/* Icono con fondo de color dinámico (opcional) o solo el icono coloreado */}
              <View style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}>
                 {/* @ts-ignore */}
                <item.icon color={item.color} size={28} />
              </View>
              
              <Text style={styles.cardLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ==========================================
// ESTILOS (StyleSheet)
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // Slate-50 equivalent
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerSpace: {
    gap: 24,
  },
  // Header Styles
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b", // Slate-800
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#475569", // Slate-600
  },
  // Button Styles
  buttonBase: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#cbd5e1", // Slate-300
  },
  buttonSolid: {
    backgroundColor: "#2563eb", // Blue-600
  },
  textOutline: {
    color: "#334155", // Slate-700
    fontWeight: "600",
  },
  textSolid: {
    color: "white",
    fontWeight: "600",
  },
  // Grid & Card Styles
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12, // Gap funciona en versiones nuevas de RN, si no, usa margins
  },
  card: {
    width: "48%", // Aproximadamente la mitad menos el espacio del gap
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    // Sombra (Shadow)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
    alignItems: "flex-start",
  },
  iconContainer: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b", // Slate-800
  },
});