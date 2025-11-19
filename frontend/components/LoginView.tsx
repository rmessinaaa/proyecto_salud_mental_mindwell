// File: LoginView.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Heart, Mail, Lock } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function LoginView() {
  const router = useRouter();

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
          {/* Email */}
          <Text style={styles.label}>Correo electrónico</Text>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="usuario@ejemplo.com"
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

          {/* Login */}
          <TouchableOpacity style={styles.button} onPress={() => console.log("Login")}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
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
// STYLES
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
