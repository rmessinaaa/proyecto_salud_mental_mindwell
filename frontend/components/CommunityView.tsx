import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, 
  ActivityIndicator, RefreshControl, Alert, KeyboardAvoidingView, Platform 
} from "react-native";
import { Send, MessageCircle, Heart, User } from "lucide-react-native";
import { api, Publicacion } from "../services/api";

export default function CommunityView() {
  const [posts, setPosts] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    cargarPosts();
  }, []);

  const cargarPosts = async () => {
    try {
      const data = await api.getPublicaciones();
      setPosts(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePublicar = async () => {
    if (!nuevoMensaje.trim()) return;
    
    setEnviando(true);
    const post = await api.crearPublicacion(nuevoMensaje);
    setEnviando(false);

    if (post) {
      setPosts([post, ...posts]); // Agregamos el nuevo al principio
      setNuevoMensaje("");
      Alert.alert("¡Enviado!", "Tu mensaje ha sido compartido con la comunidad.");
    } else {
      Alert.alert("Error", "No se pudo enviar el mensaje.");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarPosts();
  };

  const renderItem = ({ item }: { item: Publicacion }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.username.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.date}>
                {new Date(item.fecha_creacion).toLocaleDateString()}
            </Text>
        </View>
      </View>
      
      <Text style={styles.content}>{item.contenido}</Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.actionRow}>
            <Heart size={18} color="#64748b" />
            <Text style={styles.actionText}>{item.likes} Ánimos</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Comunidad MindWell</Text>
        <Text style={styles.subtitle}>Comparte tu viaje y apoya a otros</Text>
      </View>

      {/* Lista de Posts - Envuelto en flex: 1 para empujar el input al fondo */}
      <View style={{ flex: 1 }}>
        {loading ? (
            <ActivityIndicator size="large" color="#a855f7" style={{marginTop: 50}} />
        ) : (
            <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#a855f7']} />
            }
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <MessageCircle size={48} color="#cbd5e1" />
                    <Text style={styles.emptyText}>Aún no hay mensajes.</Text>
                    <Text style={styles.emptySubText}>¡Sé el primero en saludar!</Text>
                </View>
            }
            />
        )}
      </View>

      {/* Input para nuevo mensaje */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Escribe algo positivo..."
                value={nuevoMensaje}
                onChangeText={setNuevoMensaje}
                multiline
            />
            <TouchableOpacity 
                style={[styles.sendButton, !nuevoMensaje.trim() && styles.disabledButton]} 
                onPress={handlePublicar}
                disabled={enviando || !nuevoMensaje.trim()}
            >
                {enviando ? <ActivityIndicator color="white" size="small"/> : <Send size={20} color="white" />}
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { padding: 20, backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
  subtitle: { fontSize: 14, color: "#64748b", marginTop: 4 },
  listContent: { padding: 16 },
  
  card: { backgroundColor: "white", borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#e9d5ff", justifyContent: "center", alignItems: "center", marginRight: 12 },
  avatarText: { color: "#a855f7", fontWeight: "bold", fontSize: 18 },
  username: { fontWeight: "bold", color: "#334155", fontSize: 16 },
  date: { color: "#94a3b8", fontSize: 12 },
  content: { color: "#475569", fontSize: 15, lineHeight: 22, marginBottom: 12 },
  cardFooter: { borderTopWidth: 1, borderTopColor: "#f1f5f9", paddingTop: 12, flexDirection: "row" },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionText: { color: "#64748b", fontSize: 13 },

  inputContainer: { 
    flexDirection: "row", 
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // ✅ Espacio extra para evitar choques
    backgroundColor: "white", 
    borderTopWidth: 1, 
    borderTopColor: "#e2e8f0", 
    alignItems: "center", 
    gap: 10 
  },
  input: { flex: 1, backgroundColor: "#f1f5f9", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100, color: "#1e293b" },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#a855f7", justifyContent: "center", alignItems: "center" },
  disabledButton: { backgroundColor: "#e2e8f0" },

  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { fontSize: 18, fontWeight: "bold", color: "#94a3b8", marginTop: 10 },
  emptySubText: { color: "#cbd5e1" }
});