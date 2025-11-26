import React, { useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert, RefreshControl
} from "react-native";
import { useFocusEffect } from "expo-router"; 

// API
import { api, RegistroDiario } from "../services/api";

// Componentes UI
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

// Icons
import { Heart, Calendar, Clock, Plus, Minus, Zap, Activity } from "lucide-react-native";

const emotionsList = [
  { value: "feliz", icon: "😄", label: "Feliz", color: "#facc15" },
  { value: "contento", icon: "😊", label: "Contento", color: "#4ade80" },
  { value: "neutral", icon: "😐", label: "Neutral", color: "#9ca3af" },
  { value: "triste", icon: "😕", label: "Triste", color: "#60a5fa" },
  { value: "ansioso", icon: "😰", label: "Ansioso", color: "#f97316" },
  { value: "enojado", icon: "😠", label: "Enojado", color: "#ef4444" },
];

const activitiesList = ["Trabajo", "Ejercicio", "Social", "Ocio", "Descanso", "Estudio", "Familia"];

export default function DiaryView() {
  // ESTADOS DEL FORMULARIO
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  
  // ✅ NUEVOS ESTADOS PARA LOS NIVELES (Empiezan en 5)
  const [intensity, setIntensity] = useState(5);
  const [energy, setEnergy] = useState(5);

  const [saving, setSaving] = useState(false);

  // ESTADOS DE LISTA
  const [entries, setEntries] = useState<RegistroDiario[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEntries = async () => {
    try {
      const data = await api.getRegistros();
      setEntries(data);
    } catch (error) {
      console.log("Error cargando diario");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [])
  );

  const toggleActivity = (activity: string) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(prev => prev.filter(a => a !== activity));
    } else {
      setSelectedActivities(prev => [...prev, activity]);
    }
  };

  // ✅ FUNCIONES PARA CONTROLAR LOS NÚMEROS
  const handleIntensityChange = (delta: number) => {
    setIntensity(prev => Math.max(1, Math.min(10, prev + delta)));
  };
  
  const handleEnergyChange = (delta: number) => {
    setEnergy(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  // GUARDAR ENTRADA
  const handleSave = async () => {
    if (!selectedEmotion) {
      Alert.alert("Falta información", "Por favor selecciona una emoción.");
      return;
    }

    setSaving(true);
    try {
      const nuevaEntrada: RegistroDiario = {
        emocion: selectedEmotion,
        // ✅ AHORA USAMOS LOS VALORES REALES
        nivel_intensidad: intensity, 
        nivel_energia: energy,
        nota: note,
        actividades: selectedActivities.join(","), 
      };

      await api.crearRegistro(nuevaEntrada);
      
      Alert.alert("¡Guardado!", "Tu registro ha sido añadido.");
      
      // Limpiar formulario
      setSelectedEmotion(null);
      setNote("");
      setSelectedActivities([]);
      setIntensity(5); // Resetear a 5
      setEnergy(5);    // Resetear a 5
      
      fetchEntries();

    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el registro.");
    } finally {
      setSaving(false);
    }
  };

  const getEmotionIcon = (val: string) => {
    const found = emotionsList.find(e => e.value === val);
    return found ? found.icon : "❓";
  };

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchEntries(); }} />}
    >
      <View style={styles.inner}>
        {/* HEADER */}
        <View>
          <Text style={styles.title}>Diario Emocional</Text>
          <Text style={styles.subtitle}>Registra cómo te sientes hoy</Text>
        </View>

        {/* NUEVA ENTRADA */}
        <Card>
          <View style={styles.cardContent}>
            <Text style={styles.sectionTitle}>Nueva entrada</Text>

            <View style={styles.space}>
              {/* 1. EMOCIONES */}
              <Text style={styles.label}>¿Cómo te sientes?</Text>
              <View style={styles.emotionGrid}>
                {emotionsList.map((emotion, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedEmotion(emotion.value)}
                    style={[
                      styles.emotionButton,
                      { backgroundColor: emotion.color },
                      selectedEmotion === emotion.value && styles.emotionSelected,
                    ]}
                  >
                    <Text style={styles.emotionIcon}>{emotion.icon}</Text>
                    <Text style={styles.emotionText}>{emotion.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 2. CONTROLES DE INTENSIDAD Y ENERGÍA (NUEVO) */}
              <View style={styles.slidersRow}>
                {/* Intensidad */}
                <View style={styles.sliderContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                        <Activity size={16} color="#8b5cf6" style={{marginRight: 6}}/>
                        <Text style={styles.labelSmall}>Intensidad Emoción</Text>
                    </View>
                    <View style={styles.counterRow}>
                        <TouchableOpacity onPress={() => handleIntensityChange(-1)} style={styles.counterBtn}>
                            <Minus size={18} color="#4b5563"/>
                        </TouchableOpacity>
                        <Text style={styles.counterValue}>{intensity}</Text>
                        <TouchableOpacity onPress={() => handleIntensityChange(1)} style={styles.counterBtn}>
                            <Plus size={18} color="#4b5563"/>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Energía */}
                <View style={styles.sliderContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                        <Zap size={16} color="#ec4899" style={{marginRight: 6}}/>
                        <Text style={styles.labelSmall}>Nivel Energía</Text>
                    </View>
                    <View style={styles.counterRow}>
                        <TouchableOpacity onPress={() => handleEnergyChange(-1)} style={styles.counterBtn}>
                            <Minus size={18} color="#4b5563"/>
                        </TouchableOpacity>
                        <Text style={styles.counterValue}>{energy}</Text>
                        <TouchableOpacity onPress={() => handleEnergyChange(1)} style={styles.counterBtn}>
                            <Plus size={18} color="#4b5563"/>
                        </TouchableOpacity>
                    </View>
                </View>
              </View>

              {/* 3. NOTAS */}
              <View style={{marginTop: 15}}>
                <Text style={styles.label}>Nota del día</Text>
                <TextInput
                  placeholder="Describe tu día..."
                  multiline
                  numberOfLines={4}
                  style={styles.textarea}
                  value={note}
                  onChangeText={setNote}
                />
              </View>

              {/* 4. ACTIVIDADES */}
              <View style={{marginTop: 15}}>
                <Text style={styles.label}>Actividades</Text>
                <View style={styles.activitiesRow}>
                  {activitiesList.map((activity, idx) => {
                    const isSelected = selectedActivities.includes(activity);
                    return (
                      <TouchableOpacity 
                        key={idx} 
                        style={[styles.activityBadge, isSelected && styles.activitySelected]}
                        onPress={() => toggleActivity(activity)}
                      >
                          <Plus size={12} color={isSelected ? "#fff" : "#000"} />
                          <Text style={{color: isSelected ? "#fff" : "#000", marginLeft: 4}}>{activity}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* BOTONES */}
              <View style={[styles.rowInline, { marginTop: 20 }]}>
                <TouchableOpacity 
                   style={[styles.saveButton, saving && {opacity: 0.7}]}
                   onPress={handleSave}
                   disabled={saving}
                >
                  {saving ? <ActivityIndicator color="#fff"/> : (
                    <>
                      <Heart size={16} color="#fff" style={{marginRight: 6}}/>
                      <Text style={{color: 'white', fontWeight: 'bold'}}>Guardar Entrada</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Card>

        {/* LISTA DE ENTRADAS */}
        <View>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Historial</Text>
          </View>

          <View style={styles.space}>
            {loading ? (
              <ActivityIndicator size="large" color="#a855f7" />
            ) : entries.length === 0 ? (
              <Text style={{textAlign: 'center', color: '#94a3b8', marginTop: 20}}>
                No hay registros aún. ¡Crea el primero!
              </Text>
            ) : (
              entries.map((entry, idx) => (
                <Card key={idx}>
                  <View style={styles.cardEntry}>
                    <View style={styles.entryRow}>
                      <Text style={styles.entryEmotion}>{getEmotionIcon(entry.emocion)}</Text>

                      <View style={styles.entryContent}>
                        <View style={styles.entryHeader}>
                          <Text style={styles.entryMood}>{entry.emocion.toUpperCase()}</Text>
                          
                          {/* Mostrar niveles en el historial */}
                          <View style={styles.levelsBadge}>
                             <Activity size={10} color="#8b5cf6"/>
                             <Text style={styles.levelText}>{entry.nivel_intensidad}</Text>
                             <View style={{width: 6}}/>
                             <Zap size={10} color="#ec4899"/>
                             <Text style={styles.levelText}>{entry.nivel_energia}</Text>
                          </View>
                        </View>
                        
                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                            <Calendar size={12} color="#94a3b8" />
                            <Text style={styles.entryMeta}>{entry.fecha}</Text>
                            <Clock size={12} color="#94a3b8" style={{marginLeft: 8}}/>
                            <Text style={styles.entryMeta}>{entry.hora ? entry.hora.substring(0,5) : ''}</Text>
                        </View>

                        {entry.nota ? <Text style={styles.entryNote}>{entry.nota}</Text> : null}

                        <View style={styles.activitiesRow}>
                          {entry.actividades ? entry.actividades.split(',').map((a, i) => (
                            <Badge key={i}>{a}</Badge>
                          )) : null}
                        </View>
                      </View>
                    </View>
                  </View>
                </Card>
              ))
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  inner: { flex: 1, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "700", color: "#0f172a", marginBottom: 4 },
  subtitle: { color: "#475569", marginBottom: 12 },
  cardContent: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#1e293b", marginBottom: 12 },
  label: { color: "#334155", marginBottom: 8, fontWeight: '600', fontSize: 14 },
  labelSmall: { color: "#64748b", fontWeight: '500', fontSize: 12 },
  space: { marginTop: 8 },
  emotionGrid: { flexDirection: "row", flexWrap: "wrap" },
  emotionButton: { borderRadius: 12, padding: 12, alignItems: "center", width: "30%", margin: "1.5%" },
  emotionSelected: { borderWidth: 3, borderColor: "#7c3aed" },
  emotionIcon: { fontSize: 26 },
  emotionText: { fontSize: 12, fontWeight: "500", color: "#1e293b", marginTop: 6 },
  textarea: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e2e8f0", padding: 12, minHeight: 80, textAlignVertical: "top" },
  activitiesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  activityBadge: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 20, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
  activitySelected: { backgroundColor: '#a855f7', borderColor: '#a855f7' },
  rowInline: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20 },
  saveButton: { backgroundColor: "#a855f7", flexDirection: 'row', alignItems: 'center', justifyContent:'center', paddingVertical: 12, borderRadius: 10, width: '100%' },
  cardEntry: { backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 12 },
  entryRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  entryEmotion: { fontSize: 32 },
  entryContent: { flex: 1 },
  entryHeader: { flexDirection: "row", alignItems: "center", justifyContent: 'space-between' },
  entryMood: { fontSize: 14, fontWeight: "bold", color: "#0f172a" },
  entryMeta: { fontSize: 12, color: "#94a3b8", marginLeft: 4 },
  entryNote: { color: "#475569", marginVertical: 8, fontStyle: 'italic', fontSize: 13 },
  
  // Nuevos estilos para los contadores
  slidersRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15 },
  sliderContainer: { width: '48%', backgroundColor: '#f8fafc', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  counterBtn: { backgroundColor: '#fff', padding: 6, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  counterValue: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  
  levelsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  levelText: { fontSize: 10, fontWeight: 'bold', marginLeft: 2, color: '#4b5563' },
});