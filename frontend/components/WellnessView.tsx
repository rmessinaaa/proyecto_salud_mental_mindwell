// File: WellnessView.tsx
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Heart,
  Moon,
  Activity,
  Phone,
  AlertCircle,
  Play,
  Volume2,
  Clock,
  Shield,
} from "lucide-react-native";
import { useRouter } from "expo-router"; // <--- Import router

const sleepData = [
  { day: "Lun", hours: 7.5 },
  { day: "Mar", hours: 6.5 },
  { day: "Mié", hours: 8 },
  { day: "Jue", hours: 7 },
  { day: "Vie", hours: 6 },
  { day: "Sáb", hours: 9 },
  { day: "Dom", hours: 8.5 },
];

const emergencyResources = [
  { title: "Línea de Crisis Nacional", phone: "988", description: "Disponible 24/7 para apoyo inmediato", type: "Crisis" },
  { title: "Línea de Prevención del Suicidio", phone: "1-800-273-8255", description: "Apoyo confidencial y gratuito", type: "Crisis" },
  { title: "Chat de Crisis", phone: "Text HOME to 741741", description: "Servicio de texto 24/7", type: "Chat" },
];

const calmingExercises = [
  { title: "Respiración de emergencia", duration: "2 min", description: "Técnica rápida para calmar la ansiedad", icon: "💨" },
  { title: "Grounding 5-4-3-2-1", duration: "5 min", description: "Reconecta con el presente", icon: "🌟" },
  { title: "Relajación muscular rápida", duration: "3 min", description: "Libera la tensión física", icon: "💆" },
  { title: "Meditación de calma", duration: "10 min", description: "Recupera tu centro emocional", icon: "🧘" },
];

const relaxingSounds = [
  { name: "Lluvia suave", duration: "60 min", icon: "🌧️" },
  { name: "Olas del mar", duration: "60 min", icon: "🌊" },
  { name: "Bosque", duration: "60 min", icon: "🌲" },
  { name: "Fuego de chimenea", duration: "60 min", icon: "🔥" },
];

export function WellnessView() {
  const router = useRouter(); // <--- Hook de navegación
  const avgSleep = sleepData.reduce((acc, d) => acc + d.hours, 0) / (sleepData.length || 1);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Herramientas de Bienestar</Text>
        <Text style={styles.subtitle}>Recursos para tu salud integral</Text>
      </View>

      {/* Alerta de emergencia */}
      <Card>
        <View style={[styles.alertCard, styles.cardPadding]}>
          <View style={styles.alertIconWrap}>
            <AlertCircle size={24} color="white" />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>¿Necesitas ayuda inmediata?</Text>
            <Text style={styles.alertText}>
              Si estás en crisis o tienes pensamientos de autolesión, busca ayuda profesional de inmediato.
            </Text>

            <View style={styles.row}>
              <View style={styles.buttonPrimaryWrap}>
                <Button onPress={() => { /* Llamar */ }}>
                  <View style={styles.buttonRow}>
                    <Phone size={16} color="white" />
                    <Text style={styles.buttonPrimaryText}>Llamar ahora</Text>
                  </View>
                </Button>
              </View>

              <View style={styles.buttonOutlineWrap}>
                {/* CAMBIO: Ahora navega a /library */}
                <Button onPress={() => router.push("/library")}>
                  <Text style={styles.buttonOutlineText}>Ver recursos</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Card>

      {/* CAMBIO: Se eliminó la tarjeta extra de "Ver ejercicios de sueño" que estaba aquí */}

      {/* Aquí irían el resto de tus secciones (recursos de emergencia, ejercicios, sueño, sonidos, contactos, etc.) */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16, 
    paddingTop: 60, // CAMBIO: Aumentado para bajar el contenido y no chocar con notificaciones
    backgroundColor: "#ffffff" 
  },
  header: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "700", color: "#0f172a" },
  subtitle: { color: "#64748b", marginTop: 4 },
  cardPadding: { padding: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  alertCard: { flexDirection: "row", backgroundColor: "#FEF2F2", borderRadius: 12, borderWidth: 1, borderColor: "#FCA5A5" },
  alertIconWrap: { width: 48, height: 48, backgroundColor: "#EF4444", borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  alertContent: { flex: 1 },
  alertTitle: { color: "#991B1B", fontWeight: "700", marginBottom: 4 },
  alertText: { color: "#991B1B", marginBottom: 8 },
  buttonRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  buttonPrimaryWrap: { flex: 0, marginRight: 8 },
  buttonOutlineWrap: { flex: 1 },
  buttonPrimaryText: { color: "white", fontWeight: "700" },
  buttonOutlineText: { color: "#DC2626", fontWeight: "600" },
});

export default WellnessView;