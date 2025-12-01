import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
// ✅ IMPORTAMOS useFocusEffect para detectar cuando volvemos a esta pantalla
import { router, useFocusEffect } from "expo-router";

// Icons
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

// API
import { api, UserProfile } from "../services/api";

export default function DashboardView() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ CAMBIO CLAVE: Usamos useFocusEffect en lugar de useEffect
  // Esto ejecuta cargarDatos() CADA VEZ que la pantalla recibe el foco (al volver de Settings)
  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    try {
      // Opcional: Si quieres que se vea el spinner cada vez que vuelves, descomenta esto:
      // setLoading(true); 
      
      const datos = await api.getPerfil();
      if (datos) {
        setUser(datos);
      }
    } catch (error) {
      console.log("No se pudo cargar el perfil en el Dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const getFechaHoy = () => {
    const opciones: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fecha = new Date().toLocaleDateString('es-ES', opciones);
    return fecha.charAt(0).toUpperCase() + fecha.slice(1);
  };

  const go = (path: string) => {
    router.push(`/(tabs)/${path}` as any);
  };

  const go2 = (path: string) => {
    router.push(`/${path}` as any);
  };

  const specialPaths = ["charts", "achievements", "community", "calendar"];

  const quickActions = [
    { icon: Book, label: "Diario", color: "#ec4899", path: "diary" },
    { icon: TrendingUp, label: "Gráficos", color: "#22c55e", path: "charts" },
    { icon: Gamepad2, label: "Juegos", color: "#f97316", path: "game" },
    { icon: Trophy, label: "Logros", color: "#eab308", path: "achievements" },
    { icon: Library, label: "Recursos", color: "#6366f1", path: "library" },
    { icon: Users, label: "Comunidad", color: "#14b8a6", path: "community" },
    { icon: Heart, label: "Bienestar", color: "#f43f5e", path: "wellness" },
    { icon: Calendar, label: "Calendario", color: "#06b6d4", path: "calendar" },
  ];

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size="large" color="#a855f7" />
        <Text style={{marginTop: 10, color: '#64748b'}}>Cargando tu espacio...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerSpace}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingText}>
              ¡Hola, {user?.username || "Viajero"}! 👋
            </Text>
            <Text style={styles.dateText}>{getFechaHoy()}</Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          {quickActions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => specialPaths.includes(item.path) ? go2(item.path) : go(item.path)}
              style={styles.card}
            >
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  contentContainer: { padding: 16, paddingBottom: 40, paddingTop: 50 },
  headerSpace: { gap: 24 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  greetingText: { fontSize: 24, fontWeight: "bold", color: "#1e293b", marginBottom: 4, textTransform: 'capitalize' },
  dateText: { fontSize: 14, color: "#475569" },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12 },
  card: { width: "48%", backgroundColor: "white", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, alignItems: "flex-start" },
  iconContainer: { padding: 10, borderRadius: 12, marginBottom: 12 },
  cardLabel: { fontSize: 16, fontWeight: "600", color: "#1e293b" },
});