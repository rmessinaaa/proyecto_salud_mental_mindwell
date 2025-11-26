import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { useFocusEffect } from "expo-router"; // ✅ Importante: Usar useFocusEffect
import { api, LogrosResponse } from "../services/api";

export default function AchievementsView() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LogrosResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogros = async () => {
    try {
      const response = await api.getLogros();
      setData(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ CAMBIO CLAVE: Usamos useFocusEffect en lugar de useEffect
  // Esto hace que la lista se actualice automáticamente cada vez que entras a la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchLogros();
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  const unlockedCount = data?.desbloqueados.length || 0;
  const lockedCount = data?.bloqueados.length || 0;
  const totalCount = unlockedCount + lockedCount;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchLogros(); }} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Logros y Recompensas</Text>
        <Text style={styles.subtitle}>Celebra tus victorias en el camino del bienestar</Text>
      </View>

      {/* Resumen */}
      <View style={styles.progressSummary}>
        <View style={[styles.card, { backgroundColor: "#FBBF24" }]}>
          <Text style={styles.icon}>🏆</Text>
          <Text style={styles.cardLabel}>Desbloqueados</Text>
          <Text style={styles.cardStat}>{unlockedCount} / {totalCount}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#A78BFA" }]}>
          <Text style={styles.icon}>⭐</Text>
          <Text style={styles.cardLabel}>Puntos Totales</Text>
          <Text style={styles.cardStat}>{data?.puntos_totales || 0} pts</Text>
        </View>
      </View>

      {/* Logros desbloqueados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tus Logros ({unlockedCount})</Text>
        {unlockedCount === 0 && (
            <Text style={{color: '#94a3b8', fontStyle: 'italic'}}>Aún no tienes logros. ¡Completa misiones para ganar!</Text>
        )}
        {data?.desbloqueados.map((ach) => (
          <View key={ach.id} style={[styles.achievementRow, { borderLeftColor: "#F59E0B" }]}>
            <Text style={styles.rowIcon}>{ach.icono}</Text>
            <View style={{flex: 1}}>
                <Text style={styles.rowTitle}>{ach.nombre}</Text>
                <Text style={styles.rowDesc}>{ach.descripcion}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 4}}>
                    <Text style={styles.rarity}>{ach.rareza}</Text>
                    <Text style={styles.date}>+{ach.puntos} XP</Text> 
                </View>
            </View>
          </View>
        ))}
      </View>

      {/* Logros bloqueados (Secretos y Normales) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Por descubrir ({lockedCount})</Text>
        {data?.bloqueados.map((ach) => (
          <View key={ach.id} style={[styles.achievementRow, ach.es_secreto ? styles.secretRow : {}]}>
            <Text style={styles.rowIcon}>{ach.es_secreto ? "🔒" : "⚪"}</Text>
            <View style={{flex: 1}}>
                <Text style={[styles.rowTitle, ach.es_secreto && {color: 'white'}]}>
                    {ach.es_secreto ? "Logro Secreto" : ach.nombre}
                </Text>
                <Text style={[styles.rowDesc, ach.es_secreto && {color: '#cbd5e1'}]}>
                    {ach.es_secreto ? "???" : ach.descripcion}
                </Text>
                {ach.es_secreto && ach.pista && (
                    <Text style={styles.hint}>💡 Pista: {ach.pista}</Text>
                )}
                {!ach.es_secreto && (
                    <Text style={styles.rarityLocked}>Recompensa: {ach.puntos} XP</Text>
                )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F1F5F9" },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#1E293B" },
  subtitle: { fontSize: 15, color: "#64748b" },
  progressSummary: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  card: { padding: 16, borderRadius: 12, width: "48%", alignItems: 'center', justifyContent: 'center' },
  cardLabel: { color: "#1f2937", fontSize: 12, marginTop: 4, fontWeight: '600' },
  cardStat: { color: "#1f2937", fontSize: 18, fontWeight: "bold", marginTop: 2 },
  icon: { fontSize: 32 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12, color: '#334155' },
  achievementRow: { flexDirection: 'row', padding: 12, borderRadius: 12, backgroundColor: "white", marginBottom: 10, borderLeftWidth: 4, borderLeftColor: "#cbd5e1", elevation: 1 },
  secretRow: { backgroundColor: "#334155", borderLeftColor: "#1e293b" },
  rowIcon: { fontSize: 30, marginRight: 12, alignSelf: 'center' },
  rowTitle: { fontSize: 16, fontWeight: "bold", color: '#1e293b' },
  rowDesc: { color: "#64748b", fontSize: 13, marginTop: 2 },
  rarity: { fontWeight: "700", fontSize: 12, color: "#d97706" },
  rarityLocked: { fontWeight: "600", fontSize: 12, color: "#94a3b8", marginTop: 4 },
  date: { color: "#6366f1", fontSize: 12, fontWeight: 'bold' },
  hint: { color: "#fbbf24", fontSize: 12, marginTop: 4, fontStyle: 'italic' },
});