import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router"; // para navegación con Expo Router

// Datos originales
const unlockedAchievements = [
  { icon: "🔥", name: "Racha de fuego", description: "Mantén una racha de 7 días consecutivos", date: "Desbloqueado el 10 Nov 2025", rarity: "Común" },
  { icon: "📝", name: "Escritor dedicado", description: "Escribe 50 entradas en tu diario", date: "Desbloqueado el 8 Nov 2025", rarity: "Común" },
  { icon: "🧘", name: "Mente zen", description: "Completa 20 sesiones de meditación", date: "Desbloqueado el 5 Nov 2025", rarity: "Raro" },
  { icon: "⭐", name: "Nivel 5", description: "Alcanza el nivel 5", date: "Desbloqueado el 3 Nov 2025", rarity: "Común" },
  { icon: "👥", name: "Amigo solidario", description: "Ayuda a 10 miembros de la comunidad", date: "Desbloqueado el 1 Nov 2025", rarity: "Épico" },
  { icon: "📚", name: "Estudiante del bienestar", description: "Lee 15 artículos de la biblioteca", date: "Desbloqueado el 29 Oct 2025", rarity: "Raro" },
];

const inProgressAchievements = [
  { icon: "🏃", name: "Maratón de bienestar", description: "Mantén una racha de 30 días", progress: 7, total: 30, rarity: "Épico" },
  { icon: "💎", name: "Coleccionista de gemas", description: "Gana 1000 monedas", progress: 850, total: 1000, rarity: "Raro" },
  { icon: "🎯", name: "Perfeccionista", description: "Completa todas las misiones diarias por 7 días", progress: 4, total: 7, rarity: "Épico" },
  { icon: "🌟", name: "Maestro del bienestar", description: "Alcanza el nivel 10", progress: 8, total: 10, rarity: "Legendario" },
];

const lockedAchievements = [
  { icon: "🔒", name: "Logro secreto", description: "???", hint: "Algo especial sucede a medianoche..." },
  { icon: "🔒", name: "Logro secreto", description: "???", hint: "Explora todas las secciones de la app" },
  { icon: "🔒", name: "Logro secreto", description: "???", hint: "La perfección tiene su recompensa" },
];

export default function AchievementsView() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Logros y Recompensas</Text>
        <Text style={styles.subtitle}>Celebra tus victorias en el camino del bienestar</Text>
      </View>

      {/* Resumen */}
      <View style={styles.progressSummary}>
        <View style={[styles.card, { backgroundColor: "#FBBF24" }]}>
          <Text style={styles.icon}>🏆</Text>
          <Text>Total desbloqueados</Text>
          <Text>23 / 50 logros</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#A78BFA" }]}>
          <Text style={styles.icon}>⭐</Text>
          <Text>Puntos de logros</Text>
          <Text>1,850 pts</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#60A5FA" }]}>
          <Text style={styles.icon}>👑</Text>
          <Text>Rareza promedio</Text>
          <Text>Raro</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#34D399" }]}>
          <Text style={styles.icon}>⚡</Text>
          <Text>Más reciente</Text>
          <Text>Hace 1 día</Text>
        </View>
      </View>

      {/* Logros desbloqueados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Logros desbloqueados</Text>
        {unlockedAchievements.map((ach, idx) => (
          <View key={idx} style={[styles.card, { borderLeftWidth: 4, borderLeftColor: "#F59E0B", marginBottom: 8 }]}>
            <Text style={styles.icon}>{ach.icon}</Text>
            <Text style={styles.cardTitle}>{ach.name}</Text>
            <Text>{ach.description}</Text>
            <Text style={styles.rarity}>{ach.rarity}</Text>
            <Text style={styles.date}>{ach.date}</Text>
          </View>
        ))}
      </View>

      {/* Logros en progreso */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>En progreso</Text>
        {inProgressAchievements.map((ach, idx) => (
          <View key={idx} style={[styles.card, { marginBottom: 8 }]}>
            <Text style={styles.icon}>{ach.icon}</Text>
            <Text style={styles.cardTitle}>{ach.name} ({ach.progress}/{ach.total})</Text>
            <Text>{ach.description}</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${(ach.progress / ach.total) * 100}%` }]} />
            </View>
            <Text style={styles.rarity}>{ach.rarity}</Text>
          </View>
        ))}
      </View>

      {/* Logros secretos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Logros secretos</Text>
        {lockedAchievements.map((ach, idx) => (
          <View key={idx} style={[styles.card, { backgroundColor: "#1E293B", marginBottom: 8 }]}>
            <Text style={styles.icon}>{ach.icon}</Text>
            <Text style={[styles.cardTitle, { color: "white" }]}>{ach.name}</Text>
            <Text style={styles.textSecondary}>{ach.description}</Text>
            <Text style={styles.textHint}>💡 {ach.hint}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// 🎨 Estilos migrados correctamente
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F1F5F9" },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1E293B" },
  subtitle: { fontSize: 16, color: "#475569" },
  progressSummary: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 16 },
  card: { padding: 12, borderRadius: 8, backgroundColor: "white" },
  icon: { fontSize: 32, marginBottom: 8, textAlign: "center" },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  rarity: { fontWeight: "600", marginTop: 4 },
  date: { color: "#94A3B8", fontSize: 12 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  progressBarBackground: { height: 8, backgroundColor: "#E5E7EB", borderRadius: 4, overflow: "hidden", marginTop: 4 },
  progressBarFill: { height: 8, backgroundColor: "#8B5CF6" },
  textSecondary: { color: "#CBD5E1" },
  textHint: { color: "#94A3B8", fontSize: 12 },
});
