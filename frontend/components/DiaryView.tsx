// =============================
// File: components/DiaryView.tsx
// =============================

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

// IMPORTANTE: Asegúrate de que estas rutas sean correctas en tu carpeta
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// Icons
import {
  Heart,
  CloudRain,
  Sun,
  Calendar,
  Clock,
  Camera,
  Plus,
} from "lucide-react-native";

// DATA
const emotions = [
  { icon: "😄", label: "Feliz", color: "#facc15" },
  { icon: "😊", label: "Contento", color: "#4ade80" },
  { icon: "😐", label: "Neutral", color: "#9ca3af" },
  { icon: "😕", label: "Triste", color: "#60a5fa" },
  { icon: "😢", label: "Muy triste", color: "#2563eb" },
  { icon: "😠", label: "Enojado", color: "#ef4444" },
  { icon: "😰", label: "Ansioso", color: "#f97316" },
  { icon: "😌", label: "Tranquilo", color: "#2dd4bf" },
];

const previousEntries = [
  {
    date: "10 Nov 2025",
    time: "18:30",
    emotion: "😊",
    mood: "Contento",
    note: "Tuve un día productivo. Completé todas mis tareas y salí a caminar por la tarde.",
    activities: ["Ejercicio", "Trabajo"],
  },
  {
    date: "9 Nov 2025",
    time: "20:15",
    emotion: "😐",
    mood: "Neutral",
    note: "Día normal. Un poco cansado pero en general bien.",
    activities: ["Descanso"],
  },
  {
    date: "8 Nov 2025",
    time: "19:00",
    emotion: "😄",
    mood: "Feliz",
    note: "¡Excelente día! Salí con amigos y me divertí mucho. Me siento lleno de energía.",
    activities: ["Social", "Ocio"],
  },
];

// =============================
// COMPONENT
// =============================

function DiaryView() {
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>
        {/* HEADER */}
        <View>
          <Text style={styles.title}>Diario Emocional</Text>
          <Text style={styles.subtitle}>
            Registra cómo te sientes y reflexiona sobre tu día
          </Text>
        </View>

        {/* NUEVA ENTRADA */}
        <Card>
          <View style={styles.cardContent}>
            <Text style={styles.sectionTitle}>Nueva entrada</Text>

            <View style={styles.space}>
              {/* EMOCIONES */}
              <View>
                <Text style={styles.label}>¿Cómo te sientes ahora?</Text>

                <View style={styles.emotionGrid}>
                  {emotions.map((emotion, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setSelectedEmotion(idx)}
                      style={[
                        styles.emotionButton,
                        { backgroundColor: emotion.color },
                        selectedEmotion === idx && styles.emotionSelected,
                      ]}
                    >
                      <Text style={styles.emotionIcon}>{emotion.icon}</Text>
                      <Text style={styles.emotionText}>{emotion.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* INTENSIDAD */}
              <View>
                <Text style={styles.label}>Intensidad de la emoción</Text>

                <View style={styles.intensityRow}>
                  <Text style={styles.intensityText}>Leve</Text>
                  <View style={styles.sliderPlaceholder} />
                  <Text style={styles.intensityText}>Intensa</Text>
                  <Badge>5/10</Badge>
                </View>
              </View>

              {/* NOTAS */}
              <View>
                <Text style={styles.label}>¿Qué pasó hoy?</Text>
                <TextInput
                  placeholder="Describe tu día..."
                  multiline
                  numberOfLines={6}
                  style={styles.textarea}
                />
              </View>

              {/* ACTIVIDADES */}
              <View>
                <Text style={styles.label}>Actividades del día</Text>
                <View style={styles.activitiesRow}>
                  {[
                    "Trabajo",
                    "Ejercicio",
                    "Social",
                    "Ocio",
                    "Descanso",
                    "Estudio",
                    "Familia",
                    "Hobby",
                  ].map((activity, idx) => (
                    <Button key={idx}>
                      {/* @ts-ignore: TypeScript se queja del color, pero funciona */}
                      <Plus size={14} color="#000" />
                      {activity}
                    </Button>
                  ))}
                </View>
              </View>

              {/* FACTORES */}
              <View style={styles.factorsGrid}>
                <View>
                  <Text style={styles.label}>Clima emocional</Text>
                  <View style={styles.rowInline}>
                    <Button>
                      {/* @ts-ignore */}
                      <Sun size={16} color="#000" />
                      Soleado
                    </Button>
                    <Button>
                      {/* @ts-ignore */}
                      <CloudRain size={16} color="#000" />
                      Nublado
                    </Button>
                  </View>
                </View>

                <View>
                  <Text style={styles.label}>Adjuntar</Text>
                  <Button>
                    {/* @ts-ignore */}
                    <Camera size={16} color="#000" />
                    Agregar foto
                  </Button>
                </View>
              </View>

              {/* BOTONES */}
              <View style={styles.rowInline}>
                <Button>
                  {/* @ts-ignore */}
                  <Heart size={16} color="#fff" />
                  Guardar
                </Button>
                <Button>Cancelar</Button>
              </View>
            </View>
          </View>
        </Card>

        {/* ENTRADAS ANTERIORES */}
        <View>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Entradas recientes</Text>
          </View>

          <View style={styles.space}>
            {previousEntries.map((entry, idx) => (
              <Card key={idx}>
                <View style={styles.cardEntry}>
                  <View style={styles.entryRow}>
                    <Text style={styles.entryEmotion}>{entry.emotion}</Text>

                    <View style={styles.entryContent}>
                      <View style={styles.entryHeader}>
                        <Text style={styles.entryMood}>{entry.mood}</Text>
                        {/* @ts-ignore */}
                        <Calendar size={14} color="#64748b" />
                        <Text style={styles.entryMeta}>{entry.date}</Text>
                        {/* @ts-ignore */}
                        <Clock size={14} color="#64748b" />
                        <Text style={styles.entryMeta}>{entry.time}</Text>
                      </View>

                      <Text style={styles.entryNote}>{entry.note}</Text>

                      <View style={styles.activitiesRow}>
                        {entry.activities.map((a, i) => (
                          <Badge key={i}>{a}</Badge>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default DiaryView;

// =============================
// STYLES
// =============================

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  inner: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  subtitle: { color: "#475569", marginBottom: 12 },

  cardContent: { padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  label: { color: "#334155", marginBottom: 8 },
  space: { marginTop: 16 },

  emotionGrid: { flexDirection: "row", flexWrap: "wrap" },
  emotionButton: {
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    width: 70,
    margin: 6,
  },
  emotionSelected: { borderWidth: 2, borderColor: "#7c3aed" },
  emotionIcon: { fontSize: 26 },
  emotionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1e293b",
    marginTop: 6,
  },

  intensityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  intensityText: { fontSize: 14, color: "#475569" },
  sliderPlaceholder: {
    flex: 1,
    height: 6,
    marginHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "#e2e8f0",
  },

  textarea: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
  },

  activitiesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  factorsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  rowInline: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardEntry: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  entryRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  entryEmotion: { fontSize: 32 },
  entryContent: { flex: 1 },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
    flexWrap: "wrap",
  },
  entryMood: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  entryMeta: { fontSize: 12, color: "#64748b", marginHorizontal: 6 },
  entryNote: { color: "#475569", marginVertical: 8 },
});