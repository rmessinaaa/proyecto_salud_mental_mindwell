// File: components/TestConnection.tsx (o app/test.tsx si usas expo-router)
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { api } from '../services/api'; // Asegúrate de que la ruta sea correcta

export default function TestConnection() {
  const [log, setLog] = useState<string[]>([]);

  // Función para agregar mensajes a la pantalla negra
  const addLog = (msg: string) => {
    setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
    console.log(msg);
  };

  // 1. PROBAR REGISTRO
  const testRegistro = async () => {
    addLog("⏳ Intentando registrar usuario 'testuser_dummy'...");
    try {
      // Usamos un número aleatorio para no repetir el usuario si pruebas varias veces
      const randomId = Math.floor(Math.random() * 1000);
      const fakeUser = {
        username: `user${randomId}`,
        email: `user${randomId}@test.com`,
        password: "password123"
      };
      
      const res = await api.registrarUsuario(fakeUser);
      addLog(`✅ Registro Exitoso: ID Usuario ${res.id} - ${res.username}`);
      Alert.alert("Éxito", `Usuario user${randomId} creado.`);
    } catch (error: any) {
      addLog(`❌ Error Registro: ${error.message}`);
    }
  };

  // 2. PROBAR LOGIN
  const testLogin = async () => {
    addLog("⏳ Intentando Login...");
    try {
      // Asegúrate de usar un usuario que YA EXISTA. 
      // Si acabas de ejecutar testRegistro, usa esas credenciales, o usa unas fijas.
      // Aquí intentaremos loguear al último que creamos o uno hardcodeado
      const res = await api.login({
        username: "user_prueba", // <--- CAMBIA ESTO por un usuario real de tu DB
        password: "password123"
      });
      addLog(`✅ Login Exitoso. Token recibido: ${res.token.substring(0, 10)}...`);
    } catch (error: any) {
      addLog(`❌ Error Login: ${error.message}`);
    }
  };

  // 3. PROBAR OBTENER PERFIL (Requiere Login previo)
  const testPerfil = async () => {
    addLog("⏳ Solicitando Perfil (Requiere Token)...");
    try {
      const perfil = await api.getPerfil();
      if (perfil) {
        addLog(`✅ Perfil Recibido: ${perfil.username} (Nivel ${perfil.nivel_actual})`);
      } else {
        addLog("⚠️ Perfil nulo (tal vez falló la red o no hay token)");
      }
    } catch (error: any) {
      addLog(`❌ Error Perfil: ${error.message}`);
    }
  };

  // 4. LIMPIAR TODO (LOGOUT)
  const testLogout = async () => {
    await api.logout();
    addLog("🗑️ Token eliminado del dispositivo.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diagnóstico de Conexión</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="1. Test Registro (Random)" onPress={testRegistro} color="#8b5cf6" />
        <View style={{height: 10}} />
        <Button title="2. Test Login (Hardcodeado)" onPress={testLogin} color="#10b981" />
        <View style={{height: 10}} />
        <Button title="3. Test Ver Perfil (Protegido)" onPress={testPerfil} color="#3b82f6" />
        <View style={{height: 10}} />
        <Button title="4. Borrar Token (Logout)" onPress={testLogout} color="#ef4444" />
      </View>

      <Text style={styles.logTitle}>Consola de Logs:</Text>
      <ScrollView style={styles.logBox}>
        {log.map((l, i) => (
          <Text key={i} style={styles.logText}>{l}</Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#f1f5f9' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#1e293b' },
  buttonContainer: { marginBottom: 20 },
  logTitle: { fontWeight: 'bold', marginBottom: 5, color: '#334155' },
  logBox: { flex: 1, backgroundColor: '#1e293b', padding: 10, borderRadius: 8 },
  logText: { color: '#4ade80', fontFamily: 'monospace', fontSize: 12, marginBottom: 5 }
});