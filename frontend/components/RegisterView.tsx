// File: RegisterView.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Heart, User, Mail, Lock, ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function RegisterView() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.box}>

        {/* Botón volver */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/login")}>
          <ArrowLeft size={20} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Volver al inicio</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Heart size={32} color="#fff" />
          </View>
          <Text style={styles.title}>Crea tu cuenta</Text>
          <Text style={styles.subtitle}>Comienza tu viaje hacia el bienestar</Text>
        </View>

        {/* Formulario */}
        <View style={styles.card}>
          {/* Nombre */}
          <Text style={styles.label}>Nombre completo</Text>
          <View style={styles.inputWrapper}>
            <User size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Tu nombre" />
          </View>

          {/* Email */}
          <Text style={styles.label}>Correo electrónico</Text>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="tu@email.com" keyboardType="email-address" />
          </View>

          {/* Contraseña */}
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Mínimo 8 caracteres" secureTextEntry />
          </View>

          {/* Confirmar contraseña */}
          <Text style={styles.label}>Confirmar contraseña</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Repite tu contraseña" secureTextEntry />
          </View>

          {/* Checkboxes */}
          <View style={styles.checkboxContainer}>
            <View style={styles.rowCenter}>
              <View style={styles.checkbox} />
              <Text style={styles.checkboxText}>
                Acepto los Términos de Servicio y la Política de Privacidad
              </Text>
            </View>
            <View style={styles.rowCenter}>
              <View style={styles.checkbox} />
              <Text style={styles.checkboxText}>
                Deseo recibir consejos y actualizaciones por correo
              </Text>
            </View>
          </View>

          {/* Crear cuenta */}
          <TouchableOpacity style={styles.button} onPress={() => router.push("/dashboard")}>
            <Text style={styles.buttonText}>Crear cuenta</Text>
          </TouchableOpacity>

          {/* Registro */}
          <Text style={styles.registerText}>
            ¿Ya tienes cuenta?{" "}
            <Text style={styles.link} onPress={() => router.push("/login")}>
              Inicia sesión
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// ----------------------
// STYLES
// ----------------------
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#f8fafc", justifyContent: "center", alignItems: "center", padding: 16 },
  box: { width: "100%", maxWidth: 380 },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backButtonText: { color: "#8b5cf6", marginLeft: 8, fontWeight: "600" },
  header: { alignItems: "center", marginBottom: 32 },
  iconWrapper: { width: 64, height: 64, backgroundColor: "#a855f7", justifyContent: "center", alignItems: "center", borderRadius: 16, marginBottom: 12 },
  title: { fontSize: 28, color: "#0f172a", fontWeight: "700" },
  subtitle: { color: "#475569", marginTop: 4 },
  card: { backgroundColor: "white", padding: 20, borderRadius: 16, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
  label: { color: "#334155", marginBottom: 4, marginTop: 12 },
  inputWrapper: { flexDirection: "row", alignItems: "center", borderColor: "#cbd5e1", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 8 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 40, color: "#1e293b" },
  checkboxContainer: { marginTop: 12, marginBottom: 12 },
  rowCenter: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: "#94a3b8", borderRadius: 4, marginRight: 6 },
  checkboxText: { color: "#475569", flex: 1 },
  button: { marginTop: 12, backgroundColor: "#a855f7", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  registerText: { textAlign: "center", marginTop: 16, color: "#475569" },
  link: { color: "#8b5cf6", fontWeight: "600" },
});
