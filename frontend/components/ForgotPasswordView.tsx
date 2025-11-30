import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Mail, ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
// import { api } from "../services/api"; // Descomentar cuando tengas el endpoint en backend

export default function ForgotPasswordView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico.");
      return;
    }

    setLoading(true);
    try {
      // AQUÍ IRÍA LA LLAMADA AL BACKEND
      // await api.requestPasswordReset(email); 
      
      // Simulamos espera para UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        "Correo enviado", 
        "Si el correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña.",
        [{ text: "Volver al Login", onPress: () => router.back() }]
      );
    } catch (error: any) {
        Alert.alert("Error", "No se pudo procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#475569" />
        </TouchableOpacity>

        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresa tu correo electrónico y te enviaremos un enlace para que recuperes el acceso a tu cuenta.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Correo electrónico</Text>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="ejemplo@correo.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Enviar enlace</Text>
            )}
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", justifyContent: "center", alignItems: "center", padding: 16 },
  box: { width: "100%", maxWidth: 380 },
  backButton: { marginBottom: 20 },
  title: { fontSize: 24, color: "#0f172a", fontWeight: "700", marginBottom: 8 },
  subtitle: { color: "#475569", marginBottom: 24, lineHeight: 20 },
  card: { backgroundColor: "white", padding: 20, borderRadius: 16, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
  label: { color: "#334155", marginBottom: 4, marginTop: 4 },
  inputWrapper: { flexDirection: "row", alignItems: "center", borderColor: "#cbd5e1", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 20 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 40, color: "#1e293b" },
  button: { backgroundColor: "#a855f7", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
});