// File: LibraryView.tsx
import React from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Library, Play, BookOpen, Wind, Heart, Brain, Search, Clock, Star, Headphones } from "lucide-react-native";
import { useRouter } from "expo-router";

// ----------------------
//   DATA
// ----------------------
const categories = [
  { name: "Meditación", icon: Heart, color: "#ec4899", count: 24 },
  { name: "Respiración", icon: Wind, color: "#3b82f6", count: 18 },
  { name: "CBT", icon: Brain, color: "#a855f7", count: 15 },
  { name: "Mindfulness", icon: Star, color: "#facc15", count: 20 },
  { name: "Sueño", icon: Clock, color: "#6366f1", count: 12 },
  { name: "Audio", icon: Headphones, color: "#14b8a6", count: 30 },
];

const featuredContent = [
  { title: "Meditación para principiantes", type: "Audio guiado", duration: "10 min", rating: 4.8, category: "Meditación", image: "🧘‍♀️", description: "Aprende los fundamentos de la meditación con esta guía paso a paso" },
  { title: "Técnica de respiración 4-7-8", type: "Ejercicio", duration: "5 min", rating: 4.9, category: "Respiración", image: "💨", description: "Una técnica para reducir la ansiedad y mejorar el sueño" },
  { title: "Reestructuración cognitiva", type: "Artículo", duration: "15 min", rating: 4.7, category: "CBT", image: "🧠", description: "Aprende a identificar y cambiar patrones de pensamiento negativos" },
];

const recentlyViewed = [
  { title: "Escaneo corporal", duration: "12 min", image: "🌊" },
  { title: "Respiración consciente", duration: "8 min", image: "🌬️" },
  { title: "Afrontamiento del estrés", duration: "20 min", image: "💪" },
  { title: "Diario de gratitud", duration: "5 min", image: "📝" },
];

const exercises = [
  { title: "Relajación muscular progresiva", category: "Relajación", duration: "15 min", difficulty: "Principiante", icon: "💆" },
  { title: "Atención plena en la comida", category: "Mindfulness", duration: "10 min", difficulty: "Intermedio", icon: "🍽️" },
  { title: "Desafío de pensamientos automáticos", category: "CBT", duration: "20 min", difficulty: "Avanzado", icon: "🤔" },
  { title: "Meditación de amor y compasión", category: "Meditación", duration: "18 min", difficulty: "Intermedio", icon: "💝" },
];

// ----------------------
//   COMPONENTE PRINCIPAL
// ----------------------
export default function LibraryView() {
  const router = useRouter(); // <--- Hook para navegación

  function getDifficultyColor(level: string) {
    if (level === "Principiante") return "#22c55e";
    if (level === "Intermedio") return "#eab308";
    return "#ef4444";
  }

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.title}>Biblioteca de Recursos</Text>
        <Text style={styles.subtitle}>Herramientas y ejercicios para tu bienestar mental</Text>
      </View>

      {/* Buscar */}
      <View style={styles.card}>
        <View style={{ position: "relative" }}>
          <Search size={20} color="#888" style={styles.searchIcon} />
          <TextInput placeholder="Buscar ejercicios, meditaciones, artículos..." style={styles.input} />
        </View>
      </View>

      {/* Categorías */}
      <Text style={styles.sectionTitle}>Explorar por categoría</Text>
      <View style={styles.grid}>
        {categories.map((cat, i) => (
          <TouchableOpacity
            key={i}
            style={styles.categoryCard}
            onPress={() =>
              router.push({
                pathname: '/register',
                params: { name: cat.name.toLowerCase() },
              })
            }
          >
            <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
              <cat.icon size={30} color="white" />
            </View>
            <Text style={styles.categoryName}>{cat.name}</Text>
            <Text style={styles.categoryCount}>{cat.count} recursos</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Destacados */}
      <Text style={styles.sectionTitle}>Destacados para ti</Text>
      {featuredContent.map((item, i) => (
        <View key={i} style={styles.featuredCard}>
          <Text style={styles.featuredImage}>{item.image}</Text>
          <View style={{ padding: 12 }}>
            <Text style={styles.sectionBadge}>{item.category}</Text>
            <Text style={styles.sectionBadgeOutline}>{item.type}</Text>

            <Text style={styles.featuredTitle}>{item.title}</Text>
            <Text style={styles.featuredDesc}>{item.description}</Text>

            <View style={styles.featuredFooter}>
              <View style={styles.flexRow}>
                <Clock size={16} color="#555" />
                <Text>{item.duration}</Text>
              </View>

              <View style={styles.flexRow}>
                <Star size={16} color="#eab308" fill="#eab308" />
                <Text>{item.rating}</Text>
              </View>

              <TouchableOpacity style={styles.buttonSm}>
                <Play size={16} color="white" />
                <Text style={styles.buttonSmText}>Iniciar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {/* Ejercicios terapéuticos */}
      <Text style={styles.sectionTitle}>Ejercicios terapéuticos</Text>
      {exercises.map((ex, i) => (
        <View key={i} style={styles.exerciseCard}>
          <Text style={styles.exerciseEmoji}>{ex.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.exerciseTitle}>{ex.title}</Text>
            <Text style={styles.exerciseCategory}>{ex.category}</Text>

            <View style={styles.flexRow}>
              <Text style={styles.badge}>{ex.duration}</Text>
              <Text style={[styles.badge, { backgroundColor: getDifficultyColor(ex.difficulty) }]}>{ex.difficulty}</Text>
            </View>

            <TouchableOpacity style={styles.buttonFull}>
              <Play size={16} color="white" />
              <Text style={styles.buttonFullText}>Comenzar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Tip */}
      <View style={styles.tipCard}>
        <View style={styles.tipIcon}>
          <BookOpen size={28} color="white" />
        </View>
        <View>
          <Text style={styles.tipTitle}>💡 Consejo profesional</Text>
          <Text style={styles.tipDesc}>
            Practicar ejercicios de meditación o respiración diariamente mejora tu bienestar emocional.
          </Text>

          <View style={styles.flexRow}>
            <TouchableOpacity style={styles.buttonSmOutline}>
              <Text style={styles.buttonSmOutlineText}>Crear rutina</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSmOutline} onPress={() => router.push("/calendar")}>
              <Text style={styles.buttonSmOutlineText}>Programar práctica</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </ScrollView>
  );
}

// ----------------------
//   STYLES
// ----------------------
const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1e293b" },
  subtitle: { fontSize: 15, color: "#475569" },
  card: { padding: 12, backgroundColor: "white", borderRadius: 12, marginBottom: 20, elevation: 2 },
  searchIcon: { position: "absolute", left: 10, top: 12 },
  input: { backgroundColor: "#f1f5f9", borderRadius: 8, paddingVertical: 10, paddingLeft: 40, fontSize: 16 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", marginVertical: 16, color: "#1e293b" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  categoryCard: { width: "47%", backgroundColor: "white", padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, alignItems: "center" },
  categoryIcon: { width: 60, height: 60, borderRadius: 16, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  categoryName: { fontWeight: "bold", color: "#1e293b" },
  categoryCount: { color: "#64748b" },
  featuredCard: { backgroundColor: "white", borderRadius: 12, marginBottom: 20, elevation: 2 },
  featuredImage: { fontSize: 60, textAlign: "center", paddingVertical: 20, backgroundColor: "#f3e8ff" },
  featuredTitle: { fontSize: 18, fontWeight: "bold", color: "#1e293b", marginTop: 8 },
  featuredDesc: { color: "#64748b", marginVertical: 6 },
  sectionBadge: { backgroundColor: "#e2e8f0", padding: 4, borderRadius: 6, marginBottom: 4 },
  sectionBadgeOutline: { borderWidth: 1, borderColor: "#94a3b8", padding: 4, borderRadius: 6, marginBottom: 10 },
  featuredFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  flexRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  buttonSm: { flexDirection: "row", backgroundColor: "#6366f1", padding: 8, paddingHorizontal: 14, borderRadius: 6, alignItems: "center" },
  buttonSmText: { color: "white", marginLeft: 6 },
  exerciseCard: { flexDirection: "row", backgroundColor: "white", borderRadius: 12, padding: 14, marginBottom: 12, elevation: 2 },
  exerciseEmoji: { fontSize: 45, marginRight: 10 },
  exerciseTitle: { fontWeight: "bold", fontSize: 16, color: "#1e293b" },
  exerciseCategory: { color: "#64748b", marginBottom: 6 },
  badge: { backgroundColor: "#e2e8f0", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, marginRight: 8 },
  buttonFull: { backgroundColor: "#4f46e5", padding: 10, borderRadius: 6, marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  buttonFullText: { color: "white", marginLeft: 6, fontWeight: "bold" },
  tipCard: { flexDirection: "row", backgroundColor: "white", padding: 16, borderRadius: 12, marginTop: 20, elevation: 2 },
  tipIcon: { backgroundColor: "#6366f1", padding: 12, borderRadius: 10, marginRight: 12 },
  tipTitle: { fontWeight: "bold", fontSize: 18, color: "#1e293b" },
  tipDesc: { color: "#64748b", marginVertical: 6, maxWidth: "90%" },
  buttonSmOutline: { borderWidth: 1, borderColor: "#6366f1", padding: 8, paddingHorizontal: 14, borderRadius: 6, marginTop: 6, marginRight: 10 },
  buttonSmOutlineText: { color: "#6366f1", fontWeight: "bold" },
});
