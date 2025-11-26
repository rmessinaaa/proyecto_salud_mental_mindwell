// File: LoginView.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Heart, User, Lock } from "lucide-react-native"; // Cambié Mail por User para coincidir con el backend
import { useRouter } from "expo-router";
import { api } from "../services/api"; // <--- Importamos la API

export default function LoginView() {
  const router = useRouter();

  // 1. Estados para guardar los datos
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Función lógica de Login
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Atención", "Por favor ingresa tu usuario y contraseña");
      return;
    }

    setLoading(true);

    try {
      // Llamamos a tu Backend
      const response = await api.login({
        username: username,
        password: password
      });

      console.log("Login exitoso. Token:", response.token);
      
      // Si todo sale bien, vamos al Dashboard
      // Usamos 'replace' para que no puedan volver al login con el botón 'atrás'
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
          
          {/* CAMBIO: Usuario (Django usa username por defecto) */}
          <Text style={styles.label}>Nombre de usuario</Text>
          <View style={styles.inputWrapper}>
            <User size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Tu nombre de usuario"
              value={username}           // <--- Conectado
              onChangeText={setUsername} // <--- Conectado
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={password}           // <--- Conectado
              onChangeText={setPassword} // <--- Conectado
            />
          </View>

          {/* Recordarme + Olvidar */}
          <View style={styles.rowBetween}>
            <View style={styles.rowCenter}>
              <View style={styles.checkbox} />
              <Text style={styles.checkboxText}>Recordarme</Text>
            </View>

            <TouchableOpacity>
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          {/* Botón Login con Loading */}
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

          {/* Registro */}
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

// ----------------------
// STYLES (Tus estilos originales, sin cambios)
// ----------------------
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
  checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: "#94a3b8", borderRadius: 4, marginRight: 6 },
  checkboxText: { color: "#475569" },
  link: { color: "#8b5cf6", fontWeight: "600" },
  button: { marginTop: 20, backgroundColor: "#a855f7", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  registerText: { textAlign: "center", marginTop: 16, color: "#475569" },
  footerText: { textAlign: "center", color: "#64748b", marginTop: 20 },
});