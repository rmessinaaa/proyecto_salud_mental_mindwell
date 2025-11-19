import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

import {
  Star,
  Flame,
  Gift,
  Trophy,
  CheckCircle2,
  Lock
} from "lucide-react-native";

// ------------------------- DATA -----------------------------

const dailyMissions = [
  {
    id: 1,
    title: "Registra tu estado de ánimo",
    description: "Completa una entrada en tu diario emocional",
    xp: 50,
    completed: true,
    icon: "😊",
  },
  {
    id: 2,
    title: "Meditación matutina",
    description: "Completa 5 minutos de meditación guiada",
    xp: 75,
    completed: false,
    icon: "🧘",
  },
  {
    id: 3,
    title: "Ejercicio físico",
    description: "Realiza al menos 20 minutos de actividad física",
    xp: 100,
    completed: false,
    icon: "🏃",
  },
  {
    id: 4,
    title: "Conexión social",
    description: "Habla con un amigo o ser querido",
    xp: 60,
    completed: false,
    icon: "💬",
  },
];

const weeklyChallenge = [
  {
    title: "Maestro de la consistencia",
    description: "Registra tu estado de ánimo 7 días seguidos",
    progress: 4,
    total: 7,
    xp: 500,
    badge: "🔥",
  },
  {
    title: "Explorador del bienestar",
    description: "Prueba 5 ejercicios diferentes de la biblioteca",
    progress: 3,
    total: 5,
    xp: 350,
    badge: "🗺️",
  },
  {
    title: "Gurú de la meditación",
    description: "Completa 60 minutos de meditación esta semana",
    progress: 35,
    total: 60,
    xp: 600,
    badge: "🧘",
  },
];

const powerUps = [
  { name: "Doble XP", duration: "1 día", cost: 100, icon: "⚡" },
  { name: "Congelador de racha", duration: "1 uso", cost: 150, icon: "❄️" },
  { name: "Multiplicador x3", duration: "2 horas", cost: 200, icon: "🚀" },
  { name: "Revelador de secretos", duration: "Permanente", cost: 250, icon: "🔮" },
];

// ------------------------- COMPONENTE -----------------------------

export default function GameView() {
  return (
    <ScrollView style={styles.container}>
      
      {/* Header */}
      <View style={styles.section}>
        <Text style={styles.title}>Juego de Hábitos</Text>
        <Text style={styles.subtitle}>
          Construye hábitos saludables mientras te diviertes
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        {/* Nivel */}
        <View style={[styles.card, styles.purpleCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardText}>Nivel</Text>
            <Star size={20} color="white" />
          </View>

          <Text style={styles.cardValue}>Nivel 8</Text>

          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: "55%" }]} />
          </View>

          <Text style={styles.cardSmall}>2,450 / 3,000 XP</Text>
        </View>

        {/* Racha */}
        <View style={[styles.card, styles.redCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardText}>Racha actual</Text>
            <Flame size={20} color="white" />
          </View>

          <Text style={styles.cardValue}>7 días 🔥</Text>
          <Text style={styles.cardSmall}>Tu mejor racha: 15 días</Text>
        </View>

        {/* Monedas */}
        <View style={[styles.card, styles.yellowCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardText}>Monedas</Text>
            <Gift size={20} color="white" />
          </View>

          <Text style={styles.cardValue}>850 monedas</Text>

          <TouchableOpacity style={styles.whiteButton}>
            <Text style={styles.whiteButtonText}>Ganar más</Text>
          </TouchableOpacity>
        </View>

        {/* Rango */}
        <View style={[styles.card, styles.blueCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardText}>Rango</Text>
            <Trophy size={20} color="white" />
          </View>

          <Text style={styles.cardValue}>Top 15%</Text>
          <Text style={styles.cardSmall}>Entre tus amigos</Text>
        </View>
      </View>

      {/* Misiones diarias */}
      <View style={styles.block}>
        <Text style={styles.blockTitle}>Misiones diarias</Text>
        <Text style={styles.blockSubtitle}>Reinician en 8 horas</Text>

        {dailyMissions.map((m) => (
          <View
            key={m.id}
            style={[
              styles.missionCard,
              m.completed && styles.missionDone,
            ]}
          >
            <Text style={styles.missionIcon}>{m.icon}</Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.missionTitle}>
                {m.title}{" "}
                {m.completed && (
                  <CheckCircle2 size={16} color="green" />
                )}
              </Text>

              <Text style={styles.missionDesc}>{m.description}</Text>

              <Text style={styles.badge}>+{m.xp} XP</Text>
            </View>

            {!m.completed && (
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Completar</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Desafíos semanales */}
      <View style={styles.block}>
        <Text style={styles.blockTitle}>Desafíos semanales</Text>

        {weeklyChallenge.map((c, i) => (
          <View key={i} style={styles.challengeCard}>
            <Text style={styles.challengeBadge}>{c.badge}</Text>

            <Text style={styles.challengeTitle}>{c.title}</Text>
            <Text style={styles.challengeDesc}>{c.description}</Text>

            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(c.progress / c.total) * 100}%` },
                ]}
              />
            </View>

            <Text style={styles.challengeSmall}>
              {c.progress} / {c.total}
            </Text>
          </View>
        ))}
      </View>

      {/* Logros */}
      <View style={styles.block}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.blockTitle}>Próximos logros</Text>
            <Text style={styles.blockSubtitle}>
              Sigue así para conseguirlos
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/achievements")}
            style={styles.outlineButton}
          >
            <Text style={styles.outlineButtonText}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.achievementsGrid}>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>🏆</Text>
            <Text style={styles.achievementTitle}>Madrugador</Text>
            <Text style={styles.achievementSub}>3 días más</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: "66%" }]} />
            </View>
          </View>

          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>⭐</Text>
            <Text style={styles.achievementTitle}>Nivel 10</Text>
            <Text style={styles.achievementSub}>550 XP restantes</Text>
            <View style={[styles.progressBarBg]}>
              <View style={[styles.progressBarFill, { width: "82%" }]} />
            </View>
          </View>

          <View style={[styles.achievementCard, { opacity: 0.5 }]}>
            <Lock size={22} color="#777" />
            <Text style={styles.achievementTitle}>Logro secreto</Text>
            <Text style={styles.achievementSub}>???</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: "0%" }]} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}


// ------------------------- STYLES -----------------------------

const styles = StyleSheet.create({
  container: { padding: 16 },
  section: { marginBottom: 16 },
  title: { fontSize: 28, fontWeight: "700", color: "#1e1e1e" },
  subtitle: { fontSize: 16, color: "#555" },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },

  card: { padding: 16, borderRadius: 12, width: "47%" },
  purpleCard: { backgroundColor: "#a855f7" },
  redCard: { backgroundColor: "#ef4444" },
  yellowCard: { backgroundColor: "#f59e0b" },
  blueCard: { backgroundColor: "#3b82f6" },

  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  cardText: { color: "white", fontSize: 14 },
  cardValue: { color: "white", fontSize: 22, fontWeight: "700", marginBottom: 6 },
  cardSmall: { color: "white" },

  whiteButton: {
    backgroundColor: "white",
    padding: 6,
    borderRadius: 6,
    marginTop: 8,
  },
  whiteButtonText: {
    color: "#444",
    textAlign: "center",
    fontWeight: "600"
  },

  progressBarBg: {
    height: 8,
    backgroundColor: "#ffffff55",
    borderRadius: 6,
    overflow: "hidden",
    marginVertical: 4,
  },
  progressBarFill: { height: "100%", backgroundColor: "white" },

  block: { marginTop: 24 },
  blockTitle: { fontSize: 22, fontWeight: "700", color: "#1e1e1e" },
  blockSubtitle: { color: "#666", marginBottom: 12 },

  missionCard: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  missionDone: { backgroundColor: "#e8fbe8", borderColor: "#9ae6b4" },
  missionIcon: { fontSize: 32, marginRight: 12 },
  missionTitle: { fontWeight: "700", fontSize: 16, color: "#222" },
  missionDesc: { color: "#555" },
  badge: { marginTop: 4, color: "#444" },

  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: { color: "white" },

  challengeCard: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  challengeBadge: { fontSize: 32, textAlign: "center" },
  challengeTitle: { fontWeight: "700", fontSize: 16, marginTop: 8 },
  challengeDesc: { color: "#555", marginBottom: 10 },
  challengeSmall: { textAlign: "right", color: "#444" },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  outlineButtonText: { color: "#444", fontWeight: "600" },

  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  achievementCard: {
    width: "31%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  achievementIcon: { fontSize: 32, marginBottom: 6 },
  achievementTitle: { fontWeight: "700", fontSize: 14 },
  achievementSub: { color: "#777", marginBottom: 8 },
});
