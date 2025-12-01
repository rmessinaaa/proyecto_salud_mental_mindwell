import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Heart, User, Lock, Check } from "lucide-react-native"; 
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { api } from "../services/api"; 

export default function LoginView() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); 

  // 1. VERIFICAR SESIÓN AUTOMÁTICA AL INICIAR
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          console.log("Sesión recuperada");
          router.replace("/(tabs)/dashboard");
        }
      } catch (e) {
        console.log("Error recuperando sesión", e);
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Atención", "Por favor ingresa tu usuario y contraseña");
      return;
    }

    setLoading(true);

    try {
      const response = await api.login({
        username: username,
        password: password
      });

      console.log("Login exitoso.");
      
      // ==========================================
      // CORRECCIÓN CRÍTICA AQUÍ
      // ==========================================
      // Guardamos el token SIEMPRE para que la sesión funcione.
      // Si no lo guardamos aquí, las peticiones siguientes fallarán (401).
      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('userId', String(response.id));

      // Si quisieras implementar una lógica estricta de "Recordarme",
      // podrías guardar una bandera extra, pero el token es obligatorio tenerlo.
      if (rememberMe) {
        await AsyncStorage.setItem('rememberUser', 'true');
      }

      router.replace("/(tabs)/dashboard");

    } catch (error: any) {
      Alert.alert("Error de acceso", error.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Heart size={32} color="#fff" />
          </View>
          <Text style={styles.title}>MindWell</Text>
          <Text style={styles.subtitle}>Tu compañero de bienestar emocional</Text>
        </View>

        {/* Formulario */}
        <View style={styles.card}>
          
          <Text style={styles.label}>Nombre de usuario</Text>
          <View style={styles.inputWrapper}>
            <User size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Tu nombre de usuario"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* OPCIONES DE RECUPERACIÓN */}
          <View style={styles.rowBetween}>
            
            {/* Checkbox "Recordarme" */}
            <TouchableOpacity 
              style={styles.rowCenter} 
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Check size={12} color="white" />}
              </View>
              <Text style={styles.checkboxText}>Recordarme</Text>
            </TouchableOpacity>

            {/* Link Olvidaste Contraseña */}
            <TouchableOpacity onPress={() => router.push("/forgot-password")}> 
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.registerText}>
            ¿No tienes cuenta?{" "}
            <Text style={styles.link} onPress={() => router.push("/register")}>
              Regístrate aquí
            </Text>
          </Text>
        </View>

        <Text style={styles.footerText}>
          Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", justifyContent: "center", alignItems: "center", padding: 16 },
  box: { width: "100%", maxWidth: 380 },
  header: { alignItems: "center", marginBottom: 32 },
  iconWrapper: { width: 64, height: 64, backgroundColor: "#a855f7", justifyContent: "center", alignItems: "center", borderRadius: 16, marginBottom: 12 },
  title: { fontSize: 28, color: "#0f172a", fontWeight: "700" },
  subtitle: { color: "#475569", marginTop: 4 },
  card: { backgroundColor: "white", padding: 20, borderRadius: 16, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
  label: { color: "#334155", marginBottom: 4, marginTop: 12 },
  inputWrapper: { flexDirection: "row", alignItems: "center", borderColor: "#cbd5e1", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 40, color: "#1e293b" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", marginTop: 16, alignItems: "center" },
  rowCenter: { flexDirection: "row", alignItems: "center" },
  // Estilos del Checkbox
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: "#94a3b8", borderRadius: 4, marginRight: 8, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: "#a855f7", borderColor: "#a855f7" },
  checkboxText: { color: "#475569" },
  link: { color: "#8b5cf6", fontWeight: "600" },
  button: { marginTop: 20, backgroundColor: "#a855f7", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  registerText: { textAlign: "center", marginTop: 16, color: "#475569" },
  footerText: { textAlign: "center", color: "#64748b", marginTop: 20 },
});