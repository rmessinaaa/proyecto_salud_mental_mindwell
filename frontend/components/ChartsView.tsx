import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Calendar, Download, Sparkles } from "lucide-react-native";
import { LineChart, BarChart, PieChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

// --------------------------
// DATOS TRANSFORMADOS
// --------------------------

// 1. Datos para LineChart (Estado de ánimo vs Energía)
// Gifted Charts usa arrays de objetos {value, label}
const moodData = [
  { value: 7, label: "Lun" },
  { value: 6, label: "Mar" },
  { value: 8, label: "Mié" },
  { value: 7, label: "Jue" },
  { value: 9, label: "Vie" },
  { value: 8, label: "Sáb" },
  { value: 7, label: "Dom" },
];

const energyData = [
  { value: 6 },
  { value: 5 },
  { value: 7 },
  { value: 8 },
  { value: 9 },
  { value: 7 },
  { value: 6 },
];

// 2. Datos para BarChart (Impacto)
const activityBarData = [
  { value: 8.5, label: "Ejer", frontColor: '#8b5cf6' },
  { value: 7.8, label: "Soc", frontColor: '#a855f7' },
  { value: 7.5, label: "Hobby", frontColor: '#d946ef' },
  { value: 6.9, label: "Desc", frontColor: '#ec4899' },
  { value: 5.2, label: "Trab", frontColor: '#f43f5e' },
];

// 3. Datos para PieChart (Emociones)
const emotionPieData = [
  { value: 35, color: "#16a34a", text: "35%" }, // Feliz
  { value: 25, color: "#84cc16", text: "25%" }, // Contento
  { value: 20, color: "#94a3b8", text: "20%" }, // Neutral
  { value: 15, color: "#3b82f6", text: "15%" }, // Triste
  { value: 5, color: "#f97316", text: "5%" },   // Ansioso
];

// Leyenda manual para el Pie Chart (para que se vea ordenado)
const pieLegend = [
  { label: "Feliz", color: "#16a34a" },
  { label: "Contento", color: "#84cc16" },
  { label: "Neutral", color: "#94a3b8" },
  { label: "Triste", color: "#3b82f6" },
  { label: "Ansioso", color: "#f97316" },
];

export default function ChartsView() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Gráficos y Análisis</Text>
          <Text style={styles.subtitle}>Visualiza tu progreso</Text>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.buttonSmall}>
            {/* @ts-ignore */}
            <Calendar size={16} color="#333" />
            <Text style={styles.btnText}>Semana</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.buttonSmall, { marginLeft: 8 }]}>
            {/* @ts-ignore */}
            <Download size={16} color="#333" />
            <Text style={styles.btnText}>Exportar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick cards */}
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Estado promedio</Text>
          <Text style={styles.cardValue}>7.4</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Días positivos</Text>
          <Text style={styles.cardValue}>6/7</Text>
        </View>
      </View>

      {/* ---------------- LINE CHART ---------------- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tendencia semanal</Text>
        <View style={{ paddingVertical: 10 }}>
          <LineChart
            data={moodData}
            data2={energyData}
            height={220}
            width={screenWidth - 80} // Ajuste para padding
            spacing={44}
            initialSpacing={20}
            color1="#8b5cf6"
            color2="#ec4899"
            textColor1="gray"
            dataPointsColor1="#8b5cf6"
            dataPointsColor2="#ec4899"
            startFillColor1="#8b5cf6"
            startFillColor2="#ec4899"
            startOpacity={0.1}
            endOpacity={0.1}
            areaChart
            curved
            hideDataPoints={false}
            showVerticalLines
            verticalLinesColor="rgba(14,164,233,0.1)"
            yAxisColor="#eee"
            xAxisColor="#eee"
            yAxisTextStyle={{ color: 'gray', fontSize: 10 }}
          />
          {/* Leyenda simple */}
          <View style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: "#8b5cf6" }]} />
            <Text style={styles.legendText}>Ánimo</Text>
            <View style={[styles.dot, { backgroundColor: "#ec4899", marginLeft: 12 }]} />
            <Text style={styles.legendText}>Energía</Text>
          </View>
        </View>
      </View>

      {/* ---------------- PIE CHART ---------------- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Distribución de emociones</Text>
        <View style={{ alignItems: 'center', paddingVertical: 10 }}>
          <PieChart
            data={emotionPieData}
            donut
            showText
            textColor="white"
            radius={120}
            innerRadius={60}
            textSize={12}
            innerCircleColor={"#fff"}
            centerLabelComponent={() => {
              return <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>Total</Text>;
            }}
          />
        </View>
        
        {/* Leyenda manual del Pie */}
        <View style={styles.pieLegendContainer}>
          {pieLegend.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ---------------- BAR CHART ---------------- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Impacto de actividades</Text>
        <View style={{ paddingVertical: 10 }}>
          <BarChart
            data={activityBarData}
            barWidth={35}
            noOfSections={4}
            barBorderRadius={4}
            frontColor="lightgray"
            yAxisThickness={0}
            xAxisThickness={0}
            isAnimated
            animationDuration={400}
            width={screenWidth - 80}
          />
        </View>
      </View>

      {/* Insights */}
      <View style={styles.insightCard}>
        {/* @ts-ignore */}
        <Sparkles size={20} color="white" />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.insightTitle}>Insights personalizados</Text>
          <Text style={styles.insightText}>Tu estado de ánimo mejora un 23% los días que haces ejercicio.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f8fafc" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { color: "#6b7280" },
  
  headerButtons: { flexDirection: "row" },
  buttonSmall: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, backgroundColor: 'white' },
  btnText: { marginLeft: 6, color: '#374151', fontSize: 12 },
  
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  card: { flex: 1, backgroundColor: "#fff", padding: 16, borderRadius: 16, marginRight: 8, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: {width:0, height:2} },
  cardLabel: { color: "#6b7280", fontSize: 12, marginBottom: 4 },
  cardValue: { fontSize: 20, fontWeight: "700", color: '#1f2937' },
  
  section: { marginTop: 18, backgroundColor: "#fff", padding: 16, borderRadius: 16, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: {width:0, height:2} },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8, color: '#1f2937' },
  
  // Leyenda
  legendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, alignItems: 'center' },
  pieLegendContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20, gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { color: '#4b5563', fontSize: 12 },

  insightCard: { flexDirection: "row", backgroundColor: "#3b82f6", padding: 16, borderRadius: 16, marginTop: 24, alignItems: 'center', shadowColor: '#3b82f6', shadowOpacity: 0.3, shadowOffset: {width:0, height:4}, elevation: 4 },
  insightTitle: { color: "#fff", fontWeight: "700", fontSize: 14 },
  insightText: { color: "#e0f2fe", fontSize: 13, marginTop: 2 },
});