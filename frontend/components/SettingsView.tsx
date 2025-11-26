import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
  LogBox
} from "react-native";
import { useRouter } from "expo-router";
import * as Notifications from 'expo-notifications';

// Importamos tu API
import { api } from "../services/api";

// UI Components
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

import {
  User, Bell, LogOut, Globe, Pencil, ChevronLeft, X, Clock, ChevronDown
} from "lucide-react-native";

LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  'functionality is not fully supported in Expo Go',
]);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true,
  }),
});

interface SettingsViewProps {
  onLogout?: () => void;
}

export default function SettingsView({ onLogout }: SettingsViewProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Perfil
  const [biografia, setBiografia] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nivel, setNivel] = useState(1);
  const [esPremium, setEsPremium] = useState(false);

  // Configuración
  const [notifications, setNotifications] = useState({ daily: false, missions: true, events: true, email: false });
  const [dailyReminderId, setDailyReminderId] = useState<number | null>(null); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [dailyTime, setDailyTime] = useState("20:00"); 

  useEffect(() => {
    inicializar();
  }, []);

  const inicializar = async () => {
    try {
      await pedirPermisosNotificaciones();
      const perfil = await api.getPerfil();
      if (perfil) {
        setUsername(perfil.username);
        setEmail(perfil.email);
        setBiografia(perfil.biografia || "");
        setNivel(perfil.nivel_actual);
        setEsPremium(perfil.es_premium);
        setNotifications(prev => ({ ...prev, daily: perfil.notificaciones_diarias }));
      }
      const recordatorios = await api.getRecordatorios();
      const existingDaily = recordatorios.find(r => r.titulo === "Registro Diario");
      if (existingDaily && existingDaily.id) {
        setDailyReminderId(existingDaily.id);
        const date = new Date(existingDaily.fecha_hora);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        setDailyTime(`${hours}:${minutes}`);
      }
    } catch (error) {
      console.log("Error inicializando settings");
    } finally {
      setLoading(false);
    }
  };

  async function pedirPermisosNotificaciones() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted' && Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default', importance: Notifications.AndroidImportance.MAX, vibrationPattern: [0, 250, 250, 250], lightColor: '#FF231F7C',
        });
      }
    } catch (e) { console.log("Error silencioso permisos:", e); }
  }

  const handleDailySwitch = async (value: boolean) => {
    if (value) {
      setModalVisible(true);
      setNotifications(prev => ({ ...prev, daily: true }));
    } else {
      Alert.alert("Desactivar", "¿Dejar de recibir el aviso diario?", [
          { text: "Cancelar", style: "cancel" },
          { text: "Desactivar", style: "destructive", onPress: async () => {
              setNotifications(prev => ({ ...prev, daily: false }));
              if (dailyReminderId) { await api.eliminarRecordatorio(dailyReminderId); setDailyReminderId(null); }
              await Notifications.cancelAllScheduledNotificationsAsync();
              await api.updatePerfil({ notificaciones_diarias: false });
            }}
        ]);
    }
  };

  const saveDailyReminder = async () => {
    setModalVisible(false); setSaving(true);
    try {
        const now = new Date();
        const [hours, minutes] = dailyTime.split(':');
        const fechaEvento = new Date();
        fechaEvento.setHours(parseInt(hours), parseInt(minutes), 0);
        if (fechaEvento <= now) fechaEvento.setDate(fechaEvento.getDate() + 1);
        if (dailyReminderId) await api.eliminarRecordatorio(dailyReminderId);

        const nuevo = await api.crearRecordatorio({ titulo: "Registro Diario", fecha_hora: fechaEvento.toISOString(), tipo: 'diario' });
        if (nuevo && nuevo.id) setDailyReminderId(nuevo.id);

        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
            content: { title: "📝 Hora de tu Registro Diario", body: "¿Cómo te sientes hoy?", sound: true, priority: Notifications.AndroidNotificationPriority.HIGH },
            trigger: { hour: parseInt(hours), minute: parseInt(minutes), type: Notifications.SchedulableTriggerInputTypes.DAILY },
        });
        await api.updatePerfil({ notificaciones_diarias: true });
        Alert.alert("¡Listo!", `Te recordaremos a las ${dailyTime}`);
    } catch (error) { Alert.alert("Error", "No se pudo configurar."); setNotifications(prev => ({ ...prev, daily: false })); } finally { setSaving(false); }
  };

  // ✅ LÓGICA CORREGIDA Y DEPURADA DE GUARDAR CAMBIOS
  const handleGeneralSave = async () => {
    console.log("1. Botón presionado. Guardando biografía:", biografia);
    
    if (saving) return;
    setSaving(true);

    try {
      console.log("2. Enviando petición a API...");
      const response = await api.updatePerfil({
        biografia: biografia,
      });
      
      console.log("3. Respuesta exitosa:", response);
      Alert.alert("¡Guardado!", "Tu perfil se ha actualizado correctamente.");
      
    } catch (error: any) {
      console.log("4. Error en la petición:", error);
      // Mostramos el error real en la alerta para saber qué pasa
      Alert.alert("Error al guardar", error.message || "Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Salir?", [{ text: "Cancelar", style: "cancel" }, { text: "Salir", style: "destructive", onPress: async () => { await api.logout(); router.replace("/login"); } }]);
  };

  if (loading) return (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}><ActivityIndicator size="large" color="#a855f7"/></View>);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.inner}>
        
        {/* HEADER */}
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ChevronLeft size={24} color="#64748b" />
                <Text style={styles.backText}>Volver</Text>
            </TouchableOpacity>
            <View style={{ marginTop: 12 }}>
                <Text style={styles.title}>Configuración</Text>
                <Text style={styles.subtitle}>Personaliza tu experiencia</Text>
            </View>
        </View>

        {/* PERFIL */}
        <Card>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <User size={24} color="#a855f7" />
              <Text style={styles.cardTitle}>Perfil</Text>
            </View>

            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{username ? username.charAt(0).toUpperCase() : "U"}</Text>
                </View>
                <TouchableOpacity style={styles.editBadge}><Pencil size={14} color="#fff" /></TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Usuario</Text>
                  <TextInput style={[styles.input, { backgroundColor: '#f1f5f9', color: '#64748b' }]} value={username} editable={false} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Correo Electrónico</Text>
                  <TextInput style={[styles.input, { backgroundColor: '#f1f5f9', color: '#64748b' }]} value={email} editable={false} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Biografía</Text>
                  <TextInput style={styles.input} placeholder="Sobre ti..." value={biografia} onChangeText={setBiografia} multiline />
                </View>
              </View>
            </View>

            <View style={styles.separator} />
            <View style={styles.rowBetween}>
              <View><Text style={styles.label}>Nivel {nivel}</Text></View>
              
              {/* ✅ BOTÓN CORREGIDO: TouchableOpacity directo */}
              <TouchableOpacity 
                onPress={handleGeneralSave} 
                disabled={saving}
                style={styles.btnPrimary}
              >
                {saving ? (
                    <ActivityIndicator color="white" size="small" />
                ) : (
                    <Text style={styles.btnPrimaryText}>Guardar Cambios</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        <View style={styles.space} />

        {/* NOTIFICACIONES */}
        <Card>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Bell size={24} color="#3b82f6" />
              <Text style={styles.cardTitle}>Notificaciones</Text>
            </View>
            <View style={styles.settingRows}>
              <View style={styles.rowBetween}>
                <View style={styles.textContainer}>
                  <Text style={styles.settingTitle}>Registro diario</Text>
                  <Text style={styles.settingDesc}>{notifications.daily ? `Activo a las ${dailyTime}` : "Recordatorio de estado de ánimo"}</Text>
                </View>
                <Switch value={notifications.daily} onValueChange={handleDailySwitch} trackColor={{ false: "#e2e8f0", true: "#a855f7" }} />
              </View>
              <View style={styles.rowBetween}>
                <View style={styles.textContainer}>
                  <Text style={styles.settingTitle}>Misiones diarias</Text>
                  <Text style={styles.settingDesc}>Nuevas misiones y desafíos</Text>
                </View>
                <Switch value={notifications.missions} onValueChange={(v) => setNotifications({ ...notifications, missions: v })} trackColor={{ false: "#e2e8f0", true: "#a855f7" }} />
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.space} />

        {/* IDIOMA Y REGIÓN */}
        <Card>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Globe size={24} color="#14b8a6" />
              <Text style={styles.cardTitle}>Idioma y región</Text>
            </View>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Idioma</Text>
                <TouchableOpacity style={styles.fakeSelect}>
                  <Text style={styles.inputText}>Español</Text>
                  <ChevronDown size={16} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.space} />

        {/* LOGOUT */}
        <Card>
          <TouchableOpacity style={[styles.cardContent, styles.logoutCard]} onPress={handleLogout}>
            <View>
              <Text style={styles.settingTitle}>Cerrar sesión</Text>
              <Text style={styles.settingDesc}>Salir de este dispositivo</Text>
            </View>
            <View style={styles.logoutButton}>
              <LogOut size={16} color="#dc2626" style={{ marginRight: 6 }} />
              <Text style={styles.logoutText}>Salir</Text>
            </View>
          </TouchableOpacity>
        </Card>

        <View style={{ height: 40 }} />
      </View>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Configurar Hora</Text>
                    <TouchableOpacity onPress={() => { setModalVisible(false); setNotifications(prev=>({...prev, daily: false}))}}><X size={24} color="#64748b" /></TouchableOpacity>
                </View>
                <View style={{alignItems: 'center', marginVertical: 20}}>
                    <Clock size={48} color="#a855f7" style={{marginBottom: 10}}/>
                    <Text style={{textAlign: 'center', color: '#64748b', marginBottom: 15}}>¿A qué hora quieres recibir tu recordatorio diario?</Text>
                    <View style={{width: '100%'}}>
                        <Text style={styles.label}>Hora (HH:MM)</Text>
                        <TextInput style={styles.input} placeholder="20:00" value={dailyTime} onChangeText={setDailyTime} keyboardType="numbers-and-punctuation" textAlign="center" maxLength={5} />
                    </View>
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={saveDailyReminder} disabled={saving}>
                    {saving ? <ActivityIndicator color="white"/> : <Text style={styles.saveButtonText}>Guardar Recordatorio</Text>}
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  inner: { flex: 1, padding: 16 },
  space: { height: 16 },
  headerContainer: { marginBottom: 24 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  backText: { color: "#64748b", fontSize: 16, marginLeft: 4 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1e293b", marginBottom: 4 },
  subtitle: { color: "#475569", fontSize: 16 },
  cardContent: { padding: 16 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#1e293b" },
  label: { color: "#334155", marginBottom: 6, fontSize: 14, fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, padding: 12, backgroundColor: "#fff", color: "#1e293b", fontSize: 15 },
  profileSection: { flexDirection: "row", gap: 16, marginBottom: 16 },
  avatarContainer: { alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#a855f7", alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', padding: 6, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  formContainer: { flex: 1, gap: 12 },
  inputGroup: { marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  separator: { height: 1, backgroundColor: "#e2e8f0", marginVertical: 16 },
  settingRows: { gap: 16 },
  textContainer: { flex: 1, paddingRight: 8 },
  settingTitle: { fontSize: 16, color: "#1e293b", fontWeight: "500", marginBottom: 2 },
  settingDesc: { fontSize: 13, color: "#64748b" },
  logoutCard: { borderColor: '#fee2e2', borderWidth: 1, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#fecaca' },
  logoutText: { color: '#dc2626', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 16, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  saveButton: { backgroundColor: '#a855f7', padding: 14, borderRadius: 10, alignItems: 'center', width: '100%' },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  fakeSelect: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, padding: 12, backgroundColor: "#fff", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputText: { color: "#1e293b" },
  // ✅ NUEVO ESTILO PARA EL BOTÓN NATIVO
  btnPrimary: { backgroundColor: '#a855f7', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryText: { color: 'white', fontWeight: '600', fontSize: 14 },
});