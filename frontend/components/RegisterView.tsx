// File: RegisterView.tsx
import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert 
} from "react-native";
import { Heart, User, Mail, Lock, ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { api } from "../services/api"; // <--- Asegúrate de importar tu API

export default function RegisterView() {
  const router = useRouter();

  // 1. Estados para guardar los datos del formulario
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estado de carga para bloquear el botón mientras se envía
  const [loading, setLoading] = useState(false);

  // 2. Función que maneja el registro
  const handleRegister = async () => {
    // Validaciones simples
    if (!username || !email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      // Llamada al Backend
      await api.registrarUsuario({
        username: username,
        email: email,
        password: password
      });

      // Si todo sale bien:
      Alert.alert("¡Éxito!", "Cuenta creada correctamente. Ahora inicia sesión.");
      router.push("/login"); // Redirigimos al Login para obtener el Token
      
    } catch (error: any) {
      // Manejo de errores del servidor (ej: username ya existe)
      let mensajeError = "Ocurrió un error al registrarse";
      if (error.message) {
        mensajeError = error.message; // Muestra el error que manda Django
      }
      Alert.alert("Error de Registro", mensajeError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.box}>

        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/login")}>
          <ArrowLeft size={20} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Volver al inicio</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Heart size={32} color="#fff" />
          </View>
          <Text style={styles.title}>Crea tu cuenta</Text>
          <Text style={styles.subtitle}>Comienza tu viaje hacia el bienestar</Text>
        </View>

        <View style={styles.card}>
          {/* Input: Username */}
          <Text style={styles.label}>Nombre de usuario</Text>
          <View style={styles.inputWrapper}>
            <User size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Tu usuario único" 
              value={username}
              onChangeText={setUsername} // Actualiza el estado
              autoCapitalize="none"
            />
          </View>

          {/* Input: Email */}
          <Text style={styles.label}>Correo electrónico</Text>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="tu@email.com" 
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          {/* Input: Password */}
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Mínimo 8 caracteres" 
              secureTextEntry 
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Input: Confirmar Password */}
          <Text style={styles.label}>Confirmar contraseña</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Repite tu contraseña" 
              secureTextEntry 
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Checkboxes (Visuales por ahora) */}
          <View style={styles.checkboxContainer}>
            <View style={styles.rowCenter}>
              <View style={styles.checkbox} />
              <Text style={styles.checkboxText}>
                Acepto los Términos de Servicio
              </Text>
            </View>
          </View>

          {/* Botón Crear Cuenta */}
          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Crear cuenta</Text>
            )}
          </TouchableOpacity>

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

// Los estilos se mantienen exactamente igual a tu código original...
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