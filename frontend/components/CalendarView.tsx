import React, { useState, useEffect } from "react";
import { 
  View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, TextInput, StyleSheet, Platform,
  LogBox // ✅ IMPORTADO
} from "react-native";
import { useRouter } from "expo-router";
import {
  Plus, Bell, Heart, Moon, X, Trash2
} from "lucide-react-native";
import * as Notifications from 'expo-notifications';

import { api, RegistroDiario, UserProfile } from "../services/api"; 

// ✅ ESTO SILENCIA EL ERROR ROJO MOLESTO
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  'functionality is not fully supported in Expo Go',
]);

// CONFIGURACIÓN: Solo alertas locales
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const currentMonth = "Noviembre 2025"; 

export default function CalendarView() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  
  const [loading, setLoading] = useState(true);
  const [registros, setRegistros] = useState<RegistroDiario[]>([]);
  const [recordatorios, setRecordatorios] = useState<any[]>([]); 
  const [perfil, setPerfil] = useState<UserProfile | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("09:00"); 
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    configurarNotificaciones();
    cargarDatos();
  }, []);

  async function configurarNotificaciones() {
    try {
      // Pedimos permisos. Si Expo Go lanza error interno aquí, LogBox lo ocultará.
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } catch (error) {
      console.log("Error silencioso en permisos (normal en Expo Go 53):", error);
    }
  }

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const dataRegistros = await api.getRegistros();
      setRegistros(dataRegistros || []);
      const dataRecordatorios = await api.getRecordatorios();
      setRecordatorios(dataRecordatorios || []);
      const dataPerfil = await api.getPerfil();
      setPerfil(dataPerfil);
    } catch (error) {
      console.log("Error cargando datos", error);
    } finally {
      setLoading(false);
    }
  };

  const scheduleLocalNotification = async (titulo: string, secondsUntil: number) => {
    try {
        if (secondsUntil <= 0) return;

        await Notifications.scheduleNotificationAsync({
            content: { 
                title: "🔔 Recordatorio MindWell", 
                body: `Es hora de: ${titulo}`, 
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: { 
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: secondsUntil,
                repeats: false,
                channelId: 'default',
            },
        });
    } catch (error) { 
        console.log("Error programando:", error); 
    }
  };

  const handleDeleteReminder = (id: number) => {
    Alert.alert("Eliminar", "¿Borrar este recordatorio?", [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", style: "destructive", 
          onPress: async () => {
            const exito = await api.eliminarRecordatorio(id);
            if (exito) {
              Alert.alert("Eliminado", "Recordatorio borrado.");
              cargarDatos(); 
            }
          }
        }
    ]);
  };

  const handleSaveEvent = async () => {
    if (!newTitle.trim()) { Alert.alert("Error", "Escribe un título"); return; }
    setSaving(true);
    try {
        const now = new Date();
        const [horas, minutos] = newTime.split(':');
        
        const fechaEvento = new Date();
        fechaEvento.setHours(parseInt(horas), parseInt(minutos), 0);
        
        if (selectedDay !== now.getDate()) { 
            fechaEvento.setDate(selectedDay); 
        }

        if (fechaEvento.getTime() <= now.getTime()) {
             fechaEvento.setDate(fechaEvento.getDate() + 1);
        }

        const secondsUntil = Math.floor((fechaEvento.getTime() - now.getTime()) / 1000);

        await api.crearRecordatorio({
            titulo: newTitle,
            fecha_hora: fechaEvento.toISOString(),
            tipo: 'otro'
        });
        
        await scheduleLocalNotification(newTitle, secondsUntil);
        
        Alert.alert("Éxito", `Recordatorio programado para dentro de ${Math.round(secondsUntil/60)} minutos.`);
        setModalVisible(false);
        setNewTitle("");
        cargarDatos(); 
    } catch (error) { 
        Alert.alert("Error", "No se pudo guardar."); 
        console.log(error);
    } finally { 
        setSaving(false); 
    }
  };

  const handleQuickReminder = async (actividad: string) => {
    if (!perfil?.notificaciones_diarias) { Alert.alert("Aviso", "Activa las notificaciones."); return; }
    try {
        const secondsUntil = 10;
        const fecha = new Date();
        fecha.setSeconds(fecha.getSeconds() + secondsUntil);
        
        await api.crearRecordatorio({ titulo: actividad, fecha_hora: fecha.toISOString(), tipo: 'meditacion' });
        await scheduleLocalNotification(actividad, secondsUntil);

        Alert.alert("Prueba", `Notificación en ${secondsUntil} segundos.`);
        cargarDatos();
    } catch (error) { console.log(error); }
  };

  const tieneActividad = (day: number) => {
    const hayDiario = registros.some(r => new Date(r.fecha || "").getDate() === day);
    const hayRecordatorio = recordatorios.some(r => new Date(r.fecha_hora).getDate() === day);
    return hayDiario || hayRecordatorio;
  };
  const calendarDays = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1, hasActivity: tieneActividad(i + 1), isToday: i + 1 === new Date().getDate(),
  }));

  const todaySchedule = [
    { time: "08:00", title: "Meditación matutina", type: "Meditación", duration: "10 min", icon: Heart },
    { time: "21:00", title: "Rutina de sueño", type: "Sueño", duration: "20 min", icon: Moon },
  ];

  if (loading) return (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}><ActivityIndicator size="large" color="#a855f7"/></View>);

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#f8fafc" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
        <View>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#1e293b" }}>Calendario</Text>
          <Text style={{ color: "#64748b" }}>Tu viaje de bienestar</Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.newButton}>
          <Plus size={18} color="white" />
          <Text style={{ color: "white", marginLeft: 6 }}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendarCard}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16, color: "#1e293b" }}>{currentMonth}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 10 }}>
          {daysOfWeek.map((d) => (<Text key={d} style={{ color: "#94a3b8", width: 40, textAlign: "center", fontSize: 12 }}>{d}</Text>))}
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {calendarDays.map((day) => (
            <TouchableOpacity key={day.day} onPress={() => setSelectedDay(day.day)} style={[styles.dayCell, { backgroundColor: day.isToday ? "#a855f7" : selectedDay === day.day ? "#f3e8ff" : "transparent" }]}>
              <Text style={{ color: day.isToday ? "white" : "#333", fontWeight: day.isToday ? "bold" : "normal" }}>{day.day}</Text>
              {day.hasActivity && <View style={{ width: 4, height: 4, backgroundColor: day.isToday ? "white" : "#ec4899", borderRadius: 12, marginTop: 4 }} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Rutina Sugerida</Text>
      {todaySchedule.map((activity, idx) => (
        <View key={idx} style={styles.scheduleCard}>
          <activity.icon size={32} color="#a855f7" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16, color: "#1e293b" }}>{activity.title}</Text>
            <Text style={{ color: "#64748b" }}>{activity.time} • {activity.duration}</Text>
          </View>
          <TouchableOpacity onPress={() => handleQuickReminder(activity.title)} style={styles.remindButton}>
            <Bell size={14} color="#64748b" />
            <Text style={{ marginLeft: 6, fontSize: 12, color: "#64748b" }}>Recordar</Text>
          </TouchableOpacity>
        </View>
      ))}

      {recordatorios.length > 0 && (
        <>
            <Text style={styles.sectionTitle}>Tus Recordatorios</Text>
            {recordatorios.map((rec, i) => (
                <View key={i} style={styles.reminderCard}>
                    <View style={{flex: 1}}>
                        <Text style={{fontWeight: 'bold', color: '#1e293b', fontSize: 16}}>{rec.titulo}</Text>
                        <Text style={{fontSize: 12, color: '#64748b', marginTop: 2}}>
                            {new Date(rec.fecha_hora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {new Date(rec.fecha_hora).toLocaleDateString()}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteReminder(rec.id)} style={{padding: 8}}>
                        <Trash2 size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            ))}
        </>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Nuevo Recordatorio</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}><X size={24} color="#64748b" /></TouchableOpacity>
                </View>
                <View style={{gap: 16, marginVertical: 20}}>
                    <View>
                        <Text style={styles.label}>Título</Text>
                        <TextInput style={styles.input} placeholder="Ej: Ir al gimnasio" value={newTitle} onChangeText={setNewTitle} />
                    </View>
                    <View>
                        <Text style={styles.label}>Hora (HH:MM)</Text>
                        <TextInput style={styles.input} placeholder="14:30" value={newTime} onChangeText={setNewTime} keyboardType="numbers-and-punctuation" />
                    </View>
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveEvent} disabled={saving}>
                    {saving ? <ActivityIndicator color="white"/> : <Text style={styles.saveButtonText}>Guardar y Programar</Text>}
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
      <View style={{height: 60}}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    newButton: { flexDirection: "row", backgroundColor: "#a855f7", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: "center" },
    calendarCard: { backgroundColor: "white", padding: 16, borderRadius: 12, elevation: 2, marginBottom: 24 },
    dayCell: { width: "14.28%", aspectRatio: 1, justifyContent: "center", alignItems: "center", borderRadius: 10 },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 12, marginBottom: 12, color: "#1e293b" },
    scheduleCard: { backgroundColor: "white", padding: 16, marginBottom: 12, borderRadius: 12, elevation: 1, flexDirection: "row", alignItems: "center" },
    remindButton: { flexDirection: "row", paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 8, alignItems: "center" },
    reminderCard: { backgroundColor: "#f0f9ff", padding: 16, borderRadius: 12, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#3b82f6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 1 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: 'white', borderRadius: 16, padding: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
    label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6 },
    input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12, fontSize: 16 },
    saveButton: { backgroundColor: '#a855f7', padding: 14, borderRadius: 10, alignItems: 'center' },
    saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});