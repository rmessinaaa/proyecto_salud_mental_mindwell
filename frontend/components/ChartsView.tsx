import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator, 
  RefreshControl 
} from "react-native";
import { Calendar, Sparkles, BarChart3, PieChart as PieIcon } from "lucide-react-native";
import { LineChart, BarChart, PieChart } from "react-native-gifted-charts";
import { useFocusEffect } from "expo-router";
import { api } from "../services/api";

const screenWidth = Dimensions.get("window").width;

// ==========================================
// INTERFACES (Coinciden con Django DashboardStatsView)
// ==========================================

interface PieData {
  value: number;
  count: number;
  color: string;
  text: string;
  label: string;
}

interface LineData {
  value: number;
  label?: string; // Solo data1 lleva labels
}

interface BarData {
  value: number;
  label: string;
  frontColor: string;
}

interface DashboardStats {
  pie_chart: PieData[];
  line_mood: LineData[];
  line_energy: LineData[];
  bar_data: BarData[];
  promedio_general: number;
  total_dias: number;
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export default function ChartsView() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Obtener datos del Backend
  const fetchStats = async () => {
    try {
      const data = await api.getStats();
      // console.log("Datos recibidos:", JSON.stringify(data, null, 2)); // Debug si es necesario
      setStats(data);
    } catch (error) {
      console.log("Error cargando gráficos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Analizando tus emociones...</Text>
      </View>
    );
  }

  // Validaciones para mostrar estado vacío
  const hasLineData = stats?.line_mood && stats.line_mood.length > 0;
  const hasPieData = stats?.pie_chart && stats.pie_chart.length > 0;
  const hasBarData = stats?.bar_data && stats.bar_data.length > 0;

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: 60 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStats(); }} />
      }
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Tu Análisis</Text>
          <Text style={styles.subtitle}>Estadísticas basadas en tu diario</Text>
        </View>
        <View style={styles.headerIcon}>
           <BarChart3 size={24} color="#8b5cf6" />
        </View>
      </View>

      {/* Tarjetas Resumen */}
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Promedio Ánimo</Text>
          <Text style={[styles.cardValue, { color: (stats?.promedio_general || 0) >= 5 ? '#16a34a' : '#ea580c' }]}>
            {stats?.promedio_general || "-"}
            <Text style={{fontSize: 14, color: '#9ca3af'}}>/10</Text>
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Días Registrados</Text>
          <Text style={styles.cardValue}>{stats?.total_dias || 0}</Text>
        </View>
      </View>

      {!hasLineData && !hasPieData ? (
        <View style={styles.emptyState}>
          <Calendar size={48} color="#d1d5db" />
          <Text style={styles.emptyTitle}>Aún no hay suficientes datos</Text>
          <Text style={styles.emptyText}>
            Comienza a escribir en tu diario para desbloquear tus estadísticas personales.
          </Text>
        </View>
      ) : (
        <>
          {/* ---------------- 1. GRÁFICO DE LÍNEAS (Ánimo vs Energía) ---------------- */}
          {hasLineData && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tendencia Semanal</Text>
              <Text style={styles.sectionSubtitle}>Ánimo vs. Nivel de Energía</Text>
              
              <View style={{ marginTop: 20, overflow: 'hidden' }}>
                <LineChart
                  data={stats!.line_mood}
                  data2={stats!.line_energy}
                  height={220}
                  width={screenWidth - 70} // Ajuste para padding
                  spacing={40}
                  initialSpacing={20}
                  color1="#8b5cf6" // Violeta (Ánimo)
                  color2="#ec4899" // Rosa (Energía)
                  textColor1="gray"
                  dataPointsColor1="#8b5cf6"
                  dataPointsColor2="#ec4899"
                  dataPointsRadius={4}
                  thickness={3}
                  startFillColor1="#8b5cf6"
                  startFillColor2="#ec4899"
                  startOpacity={0.2}
                  endOpacity={0.0}
                  areaChart
                  curved
                  hideRules
                  showVerticalLines
                  verticalLinesColor="rgba(0,0,0,0.05)"
                  yAxisColor="transparent"
                  xAxisColor="#e5e7eb"
                  yAxisTextStyle={{ color: '#9ca3af', fontSize: 10 }}
                  xAxisLabelTextStyle={{ color: '#6b7280', fontSize: 10 }}
                  maxValue={10}
                  noOfSections={5}
                />
              </View>

              {/* Leyenda Manual */}
              <View style={styles.legendRow}>
                <View style={styles.legendBadge}>
                  <View style={[styles.dot, { backgroundColor: "#8b5cf6" }]} />
                  <Text style={styles.legendText}>Ánimo</Text>
                </View>
                <View style={styles.legendBadge}>
                  <View style={[styles.dot, { backgroundColor: "#ec4899" }]} />
                  <Text style={styles.legendText}>Energía</Text>
                </View>
              </View>
            </View>
          )}

          {/* ---------------- 2. GRÁFICO CIRCULAR (Emociones) ---------------- */}
          {hasPieData && (
            <View style={styles.section}>
              <View style={{flexDirection:'row', alignItems:'center', marginBottom: 15}}>
                 <PieIcon size={18} color="#4b5563" style={{marginRight: 8}}/>
                 <Text style={styles.sectionTitle}>Distribución Emocional</Text>
              </View>

              <View style={{ alignItems: 'center' }}>
                <PieChart
                  data={stats!.pie_chart}
                  donut
                  showText
                  textColor="white"
                  fontWeight="bold"
                  radius={110}
                  innerRadius={65}
                  textSize={14}
                  innerCircleColor={"#fff"}
                  centerLabelComponent={() => (
                     <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#1f2937' }}>{stats?.total_dias}</Text>
                        <Text style={{ fontSize: 12, color: '#9ca3af' }}>Registros</Text>
                     </View>
                  )}
                />
              </View>

              <View style={styles.pieLegendContainer}>
                {stats!.pie_chart.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.label} ({item.count})</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ---------------- 3. GRÁFICO DE BARRAS (Actividades) ---------------- */}
          {hasBarData && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top Actividades</Text>
              <Text style={styles.sectionSubtitle}>Lo que más has hecho últimamente</Text>
              
              <View style={{ paddingVertical: 20 }}>
                <BarChart
                  data={stats!.bar_data}
                  barWidth={32}
                  spacing={24}
                  barBorderRadius={6}
                  frontColor="#8b5cf6" // Color fallback
                  yAxisThickness={0}
                  xAxisThickness={1}
                  xAxisColor="#e5e7eb"
                  isAnimated
                  width={screenWidth - 80}
                  noOfSections={4}
                  yAxisTextStyle={{color: '#9ca3af'}}
                  xAxisLabelTextStyle={{color: '#4b5563', fontSize: 11}}
                />
              </View>
            </View>
          )}

          {/* ---------------- INSIGHT / CONSEJO ---------------- */}
          <View style={styles.insightCard}>
            <Sparkles size={24} color="#fbbf24" style={{marginRight: 12}} />
            <View style={{ flex: 1 }}>
              <Text style={styles.insightTitle}>Resumen</Text>
              <Text style={styles.insightText}>
                {(stats?.promedio_general || 0) >= 7 
                  ? "¡Tienes una racha muy positiva! Identifica qué actividades (gráfica de barras) te están ayudando a mantenerte así." 
                  : "Estás pasando por días retadores. Revisa qué emociones predominan y trata de realizar actividades que suban tu energía."}
              </Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#64748b', fontSize: 14 },
  
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, marginTop: 10 },
  title: { fontSize: 24, fontWeight: "800", color: "#1e293b" },
  subtitle: { color: "#64748b", fontSize: 14 },
  headerIcon: { backgroundColor: '#ede9fe', padding: 8, borderRadius: 12 },

  cardRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  card: { flex: 1, backgroundColor: "#fff", padding: 16, borderRadius: 20, marginRight: 10, shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: {width:0, height:4}, elevation: 2 },
  cardLabel: { color: "#64748b", fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 6 },
  cardValue: { fontSize: 24, fontWeight: "800", color: '#0f172a' },

  section: { marginBottom: 20, backgroundColor: "#fff", padding: 20, borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: {width:0, height:4}, elevation: 2 },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: '#1e293b' },
  sectionSubtitle: { fontSize: 12, color: '#94a3b8', marginBottom: 5 },

  legendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 15, gap: 16 },
  legendBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  
  pieLegendContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20, gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 8, marginBottom: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { color: '#475569', fontSize: 12, fontWeight: '500' },

  insightCard: { flexDirection: "row", backgroundColor: "#1e293b", padding: 20, borderRadius: 20, alignItems: 'center', shadowColor: '#1e293b', shadowOpacity: 0.3, shadowOffset: {width:0, height:8}, elevation: 8, marginBottom: 20 },
  insightTitle: { color: "#fff", fontWeight: "700", fontSize: 15, marginBottom: 4 },
  insightText: { color: "#cbd5e1", fontSize: 13, lineHeight: 18 },

  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#334155', marginTop: 16 },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 8, lineHeight: 20 },
});