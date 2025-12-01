import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Alert } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Star, Flame, Gift, Trophy } from "lucide-react-native";
import { api, UserProfile, LogrosResponse } from "../services/api"; // ✅ Importar API y tipos

// Misiones Diarias (Mocks visuales, pero la acción de completar sí es real)
const dailyMissionsMock = [
  { id: 1, title: "Registra tu estado de ánimo", description: "Completa una entrada hoy", xp: 50, icon: "😊" },
  { id: 2, title: "Meditación express", description: "Usa un recurso de la biblioteca", xp: 30, icon: "🧘" },
  { id: 3, title: "Racha perfecta", description: "Entra a la app 3 días seguidos", xp: 100, icon: "🔥" },
];

export default function GameView() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logrosData, setLogrosData] = useState<LogrosResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    // Cargar perfil y logros en paralelo para que sea rápido
    const [userData, gamificationData] = await Promise.all([
      api.getPerfil(),
      api.getLogros()
    ]);
    setProfile(userData);
    setLogrosData(gamificationData);
    setRefreshing(false);
  };

  // Cargar datos cada vez que entras a la pantalla
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // ✅ Función para completar misiones conectada al Backend
  const handleCompleteMission = async (mision: any) => {
    try {
        const resultado = await api.registrarAccion('mision_diaria', mision.xp);
        
        if (resultado) {
             let mensaje = `Ganaste +${mision.xp} XP.`;
             
             if (resultado.logros_nuevos && resultado.logros_nuevos.length > 0) {
                 mensaje += `\n\n🏆 ¡Nuevo Logro: ${resultado.logros_nuevos[0]}!`;
             }

             Alert.alert("¡Misión Cumplida!", mensaje, [
                { text: "Ok", onPress: () => loadData() } // Recargamos para ver la XP subir
             ]);
        }
    } catch (e) {
        console.error(e);
        Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  // Calcular XP basado en puntos de logros (Si tu modelo de perfil tiene experiencia_actual, úsalo aquí)
  // Por ahora, usamos profile.experiencia_actual que agregamos recientemente al backend
  const currentXP = profile?.experiencia_actual || 0;
  const currentLevel = profile?.nivel_actual || 1;
  const nextLevelXP = currentLevel * 100; // Formula simple: Nivel * 100
  const progressPercent = Math.min((currentXP / nextLevelXP) * 100, 100);

  return (
    <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer} // ✅ AÑADIDO: Estilo para el contenedor del contenido
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />}
    >
      
      {/* Header */}
      <View style={styles.section}>
        <Text style={styles.title}>Tu Progreso</Text>
        <Text style={styles.subtitle}>
          ¡Hola {profile?.username || "Jugador"}! Estás construyendo grandes hábitos.
        </Text>
      </View>

      {/* Stats Principales (Conectadas a Backend) */}
      <View style={styles.statsGrid}>
        
        {/* Nivel */}
        <View style={[styles.card, styles.purpleCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardText}>Nivel Actual</Text>
            <Star size={20} color="white" />
          </View>
          <Text style={styles.cardValue}>{currentLevel}</Text>
          
          {/* Barra de Progreso */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.cardSmall}>{currentXP} / {nextLevelXP} XP</Text>
        </View>

        {/* Logros Totales */}
        <View style={[styles.card, styles.yellowCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardText}>Logros</Text>
            <Trophy size={20} color="white" />
          </View>
          <Text style={styles.cardValue}>
             {logrosData?.desbloqueados.length || 0}
          </Text>
          <Text style={styles.cardSmall}>Desbloqueados</Text>
        </View>

        {/* Racha (Simulada hasta tener backend de rachas) */}
        <View style={[styles.card, styles.redCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardText}>Racha</Text>
            <Flame size={20} color="white" />
          </View>
          <Text style={styles.cardValue}>Activa 🔥</Text>
          <Text style={styles.cardSmall}>¡Sigue así!</Text>
        </View>

        {/* Monedas (Placeholder) */}
        <View style={[styles.card, styles.blueCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardText}>Recompensas</Text>
            <Gift size={20} color="white" />
          </View>
          <Text style={styles.cardValue}>Tienda</Text>
          <TouchableOpacity style={styles.whiteButton} onPress={() => alert("Próximamente")}>
            <Text style={styles.whiteButtonText}>Ver</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Misiones Diarias */}
      <View style={styles.block}>
        <Text style={styles.blockTitle}>Misiones de hoy</Text>
        <Text style={styles.blockSubtitle}>Complétalas para ganar XP</Text>

        {dailyMissionsMock.map((m) => (
          <View key={m.id} style={styles.missionCard}>
            <Text style={styles.missionIcon}>{m.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.missionTitle}>{m.title}</Text>
              <Text style={styles.missionDesc}>{m.description}</Text>
              <Text style={styles.badge}>+{m.xp} XP</Text>
            </View>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => handleCompleteMission(m)}
            >
               <Text style={styles.buttonText}>Completar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Acceso Directo a Logros Completos */}
      <View style={styles.block}>
        <View style={styles.rowBetween}>
            <View>
                <Text style={styles.blockTitle}>Últimos Logros</Text>
                <Text style={styles.blockSubtitle}>Tus medallas más recientes</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/achievements")} style={styles.outlineButton}>
                <Text style={styles.outlineButtonText}>Ver todos</Text>
            </TouchableOpacity>
        </View>

        {/* Mostramos los últimos 3 logros desbloqueados */}
        <View style={styles.achievementsGrid}>
            {logrosData?.desbloqueados.slice(0, 3).map((ach) => (
                <View key={ach.id} style={styles.achievementCard}>
                    <Text style={styles.achievementIcon}>{ach.icono}</Text>
                    <Text style={styles.achievementTitle} numberOfLines={1}>{ach.nombre}</Text>
                    <Text style={styles.achievementSub} numberOfLines={1}>{ach.rareza}</Text>
                </View>
            ))}
            {(!logrosData?.desbloqueados || logrosData.desbloqueados.length === 0) && (
                <Text style={{color: '#999', fontStyle: 'italic'}}>Aún no hay trofeos recientes.</Text>
            )}
        </View>
      </View>

      {/* ✅ ESPACIADOR FINAL: Para asegurar que el scroll llegue hasta abajo */}
      <View style={{ height: 120 }} />

    </ScrollView>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: { 
    flex: 1, // Importante para que el scroll ocupe toda la pantalla
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 60, // Mantenemos el margen superior aquí
    paddingBottom: 40, // Padding base inferior
  },
  section: { marginBottom: 16 },
  title: { fontSize: 28, fontWeight: "700", color: "#1e1e1e" },
  subtitle: { fontSize: 16, color: "#555" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: { padding: 16, borderRadius: 16, width: "47%", shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  purpleCard: { backgroundColor: "#a855f7" },
  redCard: { backgroundColor: "#ef4444" },
  yellowCard: { backgroundColor: "#f59e0b" },
  blueCard: { backgroundColor: "#3b82f6" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  cardText: { color: "white", fontSize: 14, fontWeight: '500' },
  cardValue: { color: "white", fontSize: 22, fontWeight: "800", marginBottom: 6 },
  cardSmall: { color: "rgba(255,255,255,0.9)", fontSize: 12 },
  whiteButton: { backgroundColor: "white", padding: 6, borderRadius: 6, marginTop: 8, alignItems: 'center' },
  whiteButtonText: { color: "#3b82f6", fontWeight: "700", fontSize: 12 },
  progressBarBg: { height: 6, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 6, overflow: "hidden", marginVertical: 6 },
  progressBarFill: { height: "100%", backgroundColor: "white" },
  block: { marginTop: 24, marginBottom: 20 },
  blockTitle: { fontSize: 20, fontWeight: "700", color: "#1e1e1e" },
  blockSubtitle: { color: "#666", marginBottom: 12 },
  missionCard: { flexDirection: "row", padding: 16, backgroundColor: "#fff", borderRadius: 16, marginBottom: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.03, elevation: 1 },
  missionIcon: { fontSize: 28, marginRight: 16 },
  missionTitle: { fontWeight: "700", fontSize: 16, color: "#222" },
  missionDesc: { color: "#64748b", fontSize: 13 },
  badge: { marginTop: 4, color: "#6366f1", fontWeight: 'bold', fontSize: 12 },
  button: { backgroundColor: "#dcfce7", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  buttonText: { color: "#166534", fontWeight: '600' },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  outlineButton: { borderWidth: 1, borderColor: "#cbd5e1", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  outlineButtonText: { color: "#475569", fontWeight: "600", fontSize: 12 },
  achievementsGrid: { flexDirection: "row", gap: 10 },
  achievementCard: { width: "31%", backgroundColor: "white", borderRadius: 12, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  achievementIcon: { fontSize: 28, marginBottom: 6 },
  achievementTitle: { fontWeight: "700", fontSize: 12, color: '#334155', textAlign: 'center' },
  achievementSub: { color: "#94a3b8", fontSize: 10, textAlign: 'center' },
});