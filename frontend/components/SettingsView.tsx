// =============================
// File: DiaryView.tsx (CORREGIDO)
// =============================
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

import {
  Heart,
  CloudRain,
  Sun,
  Calendar,
  Clock,
  Camera,
  Plus,
} from "lucide-react-native";

import { ViewType } from "../types/navigation";

interface DiaryViewProps {
  onNavigate: (view: ViewType) => void;
}

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

export function DiaryView({ onNavigate }: DiaryViewProps) {
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
                      <Plus size={16} />
                      {activity}
                    </Button>
                  ))}
                </View>
              </View>

              {/* FACTORES */}
              <View style={styles.factorsGrid}>
                <View>
                  <Text style={styles.label}>Clima emocional</Text>
                  <View style={styles.row}>
                    <Button>
                      <Sun size={18} />
                      Soleado
                    </Button>
                    <Button>
                      <CloudRain size={18} />
                      Nublado
                    </Button>
                  </View>
                </View>

                <View>
                  <Text style={styles.label}>Adjuntar</Text>
                  <Button>
                    <Camera size={18} />
                    Agregar foto
                  </Button>
                </View>
              </View>

              {/* BOTONES */}
              <View style={styles.row}>
                <Button>
                  <Heart size={18} />
                  Guardar
                </Button>
                <Button onPress={() => onNavigate("dashboard")}>Cancelar</Button>
              </View>
            </View>
          </View>
        </Card>

        {/* ENTRADAS ANTERIORES */}
        <View>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Entradas recientes</Text>
            <Button onPress={() => onNavigate("charts")}>Ver estadísticas</Button>
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
                        <Calendar size={16} color="#64748b" />
                        <Text style={styles.entryMeta}>{entry.date}</Text>
                        <Clock size={16} color="#64748b" />
                        <Text style={styles.entryMeta}>{entry.time}</Text>
                      </View>

                      <Text style={styles.entryNote}>{entry.note}</Text>

                      <View style={styles.activitiesRow}>
                        {entry.activities.map((a, i) => (
                          <Badge key={i}>{a}</Badge>
                        ))}
                      </View>
                    </View>

                    <Button>Ver más</Button>
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  inner: { flex: 1 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
  subtitle: { color: "#475569" },
  cardContent: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#1e293b", marginBottom: 12 },
  label: { color: "#334155", marginBottom: 8 },
  space: { marginTop: 16 },
  emotionGrid: { flexDirection: "row", flexWrap: "wrap" },
  emotionButton: { borderRadius: 12, padding: 12, alignItems: "center", width: 70, margin: 6 },
  emotionSelected: { borderWidth: 2, borderColor: "#9333ea" },
  emotionIcon: { fontSize: 22 },
  emotionText: { fontSize: 12, color: "#1e293b" },
  intensityRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  intensityText: { color: "#475569" },
  sliderPlaceholder: { flex: 1, height: 6, backgroundColor: "#e5e7eb", borderRadius: 4 },
  textarea: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, padding: 12, minHeight: 120, backgroundColor: "#fff" },
  activitiesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  factorsGrid: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardEntry: { padding: 16 },
  entryRow: { flexDirection: "row", gap: 12 },
  entryEmotion: { fontSize: 32 },
  entryContent: { flex: 1 },
  entryHeader: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  entryMood: { fontSize: 16, fontWeight: "600" },
  entryMeta: { color: "#64748b" },
  entryNote: { marginTop: 6, color: "#475569" },
});

