import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Modal,
  ActivityIndicator
} from "react-native";
import { 
  Heart, Wind, Brain, Star, Clock, Headphones, 
  Search, Play, BookOpen, X 
} from "lucide-react-native";
import { useRouter } from "expo-router";

// ✅ Importamos la API y la interfaz de perfil
import { api, UserProfile } from "../services/api";

// ----------------------
//   DATA (Simulada para la interfaz)
// ----------------------
const categories = [
  { name: "Meditación", icon: Heart, color: "#ec4899", count: 24 },
  { name: "Respiración", icon: Wind, color: "#3b82f6", count: 18 },
  { name: "CBT", icon: Brain, color: "#a855f7", count: 15 },
  { name: "Mindfulness", icon: Star, color: "#facc15", count: 20 },
  { name: "Sueño", icon: Clock, color: "#6366f1", count: 12 },
  { name: "Audio", icon: Headphones, color: "#14b8a6", count: 30 },
];

const featuredContent = [
  { id: 1, title: "Meditación para principiantes", type: "Audio guiado", duration: "10 min", rating: 4.8, category: "Meditación", image: "🧘‍♀️", description: "Aprende los fundamentos de la meditación con esta guía paso a paso", xp: 50 },
  { id: 2, title: "Técnica de respiración 4-7-8", type: "Ejercicio", duration: "5 min", rating: 4.9, category: "Respiración", image: "💨", description: "Una técnica para reducir la ansiedad y mejorar el sueño", xp: 30 },
  { id: 3, title: "Reestructuración cognitiva", type: "Artículo", duration: "15 min", rating: 4.7, category: "CBT", image: "🧠", description: "Aprende a identificar y cambiar patrones de pensamiento negativos", xp: 40 },
];

const exercises = [
  { id: 4, title: "Relajación muscular", category: "Relajación", duration: "15 min", difficulty: "Principiante", icon: "💆", xp: 25 },
  { id: 5, title: "Atención plena al comer", category: "Mindfulness", duration: "10 min", difficulty: "Intermedio", icon: "🍽️", xp: 20 },
  { id: 6, title: "Desafío de pensamientos", category: "CBT", duration: "20 min", difficulty: "Avanzado", icon: "🤔", xp: 40 },
  { id: 7, title: "Amor y compasión", category: "Meditación", duration: "18 min", difficulty: "Intermedio", icon: "💝", xp: 35 },
];

// ----------------------
//   COMPONENTE PRINCIPAL
// ----------------------
export default function LibraryView() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);
  
  // Estado para el modal y recurso activo
  const [activeResource, setActiveResource] = useState<any | null>(null);

  // ✅ Nuevo Estado: Perfil del usuario (para chequear notificaciones)
  const [perfil, setPerfil] = useState<UserProfile | null>(null);

  // 1. Cargar perfil al montar el componente
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await api.getPerfil();
        setPerfil(data);
      } catch (error) {
        console.log("No se pudo cargar la configuración del usuario en Library");
      }
    };
    cargarPerfil();
  }, []);

  function getDifficultyColor(level: string) {
    if (level === "Principiante") return "#22c55e"; 
    if (level === "Intermedio") return "#eab308";   
    return "#ef4444";                               
  }

  // ✅ Lógica Conectada al Backend y a Settings
  const handleCompleteResource = async () => {
    if (!activeResource) return;
    setLoadingAction(true);

    try {
      // 1. Enviamos la acción al servidor (Django)
      const resultado = await api.registrarAccion('recurso_completado', activeResource.xp);

      if (resultado) {
        let titulo = "¡Excelente trabajo!";
        let mensaje = `Has completado "${activeResource.title}" y ganado +${activeResource.xp} XP.`;
        
        // Logros desbloqueados
        if (resultado.logros_nuevos && resultado.logros_nuevos.length > 0) {
          mensaje += `\n\n🏆 ¡Logro Desbloqueado: ${resultado.logros_nuevos[0]}!`;
        }

        // ✅ CONEXIÓN CON SETTINGS: Mensaje personalizado según notificaciones
        if (perfil && perfil.notificaciones_diarias) {
             mensaje += `\n\n📅 Gracias a que tienes los recordatorios activos, te avisaremos mañana para mantener tu racha.`;
        } else {
             mensaje += `\n\n💡 Tip: Activa las notificaciones en Configuración para recibir recordatorios de tus prácticas.`;
        }

        Alert.alert(titulo, mensaje, [
            { text: "Continuar", onPress: () => setActiveResource(null) }
        ]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Hubo un problema guardando tu progreso. Revisa tu conexión.");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: 120 }} // ✅ AUMENTADO A 120 PARA QUE SE VEA EL TIP CARD
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.title}>Biblioteca</Text>
          <Text style={styles.subtitle}>Herramientas para tu mente</Text>
        </View>

        {/* Buscar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput 
            placeholder="Buscar ejercicios..." 
            style={styles.input} 
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Categorías */}
        <Text style={styles.sectionTitle}>Explorar</Text>
        <View style={styles.grid}>
          {categories.map((cat, i) => (
            <TouchableOpacity
              key={i}
              style={styles.categoryCard}
              onPress={() => Alert.alert("Categoría", `Explorando ${cat.name}`)}
            >
              <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
                {/* @ts-ignore */}
                <cat.icon size={28} color="white" />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryCount}>{cat.count}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Destacados */}
        <Text style={styles.sectionTitle}>Recomendado para ti</Text>
        {featuredContent.map((item) => (
          <TouchableOpacity key={item.id} style={styles.featuredCard} onPress={() => setActiveResource(item)}>
            <Text style={styles.featuredImage}>{item.image}</Text>
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                 <Text style={styles.sectionBadge}>{item.category}</Text>
                 <Text style={styles.xpBadge}>+{item.xp} XP</Text>
              </View>

              <Text style={styles.featuredTitle}>{item.title}</Text>
              <Text style={styles.featuredDesc}>{item.description}</Text>

              <View style={styles.featuredFooter}>
                <View style={styles.flexRow}>
                  <Clock size={14} color="#64748b" />
                  <Text style={styles.metaText}>{item.duration}</Text>
                </View>
                <View style={styles.flexRow}>
                  <Star size={14} color="#eab308" fill="#eab308" />
                  <Text style={styles.metaText}>{item.rating}</Text>
                </View>
                <View style={styles.buttonSm}>
                  <Play size={14} color="white" fill="white" />
                  <Text style={styles.buttonSmText}>Abrir</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Ejercicios Rápidos */}
        <Text style={styles.sectionTitle}>Ejercicios Prácticos</Text>
        {exercises.map((ex) => (
          <TouchableOpacity key={ex.id} style={styles.exerciseCard} onPress={() => setActiveResource(ex)}>
            <Text style={styles.exerciseEmoji}>{ex.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.exerciseTitle}>{ex.title}</Text>
              <Text style={styles.exerciseCategory}>{ex.category}</Text>
              
              <View style={styles.flexRow}>
                 <Text style={[styles.badgeText, { color: getDifficultyColor(ex.difficulty) }]}>
                   ● {ex.difficulty}
                 </Text>
                 <Text style={styles.metaText}> • {ex.duration}</Text>
              </View>
            </View>
            <View style={styles.playIconBtn}>
                <Play size={20} color="#4f46e5" fill="#4f46e5" />
            </View>
          </TouchableOpacity>
        ))}

        {/* Tip Card - Ahora sí debería verse completa */}
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <BookOpen size={24} color="white" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.tipTitle}>Sabías que...</Text>
            <Text style={styles.tipDesc}>
              Leer 15 minutos al día reduce el estrés en un 68%.
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* MODAL DE RECURSO */}
      <Modal visible={!!activeResource} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setActiveResource(null)}>
                    <X size={28} color="#333" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
                <Text style={{fontSize: 80, textAlign:'center', marginBottom: 20}}>
                    {activeResource?.image || activeResource?.icon}
                </Text>
                <Text style={styles.modalTitle}>{activeResource?.title}</Text>
                <Text style={styles.modalCategory}>{activeResource?.type || activeResource?.category}</Text>
                
                <Text style={styles.modalBody}>
                    Aquí iría el contenido real del recurso (reproductor de audio, texto del artículo, etc).
                    {"\n\n"}
                    Este contenido está diseñado para durar {activeResource?.duration}.
                </Text>

                <TouchableOpacity 
                    style={[styles.completeButton, loadingAction && { opacity: 0.7 }]} 
                    onPress={handleCompleteResource}
                    disabled={loadingAction}
                >
                    {loadingAction ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.completeButtonText}>Terminar y Ganar +{activeResource?.xp} XP</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </View>
  );
}

// ----------------------
//   STYLES
// ----------------------
const styles = StyleSheet.create({
  container: { 
    padding: 16,
    paddingTop: 60 // ✅ AJUSTE: Margen superior para evitar superposición con notificaciones
  },
  title: { fontSize: 28, fontWeight: "800", color: "#1e293b" },
  subtitle: { fontSize: 16, color: "#64748b", marginTop: 4 },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: "white", borderRadius: 12, paddingHorizontal: 12, marginTop: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#1e293b' },
  
  sectionTitle: { fontSize: 20, fontWeight: "700", marginTop: 24, marginBottom: 12, color: "#334155" },
  
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  categoryCard: { width: "31%", backgroundColor: "white", padding: 12, borderRadius: 16, marginBottom: 12, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.03, elevation: 1 },
  categoryIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  categoryName: { fontWeight: "600", fontSize: 12, color: "#1e293b", textAlign: 'center' },
  categoryCount: { color: "#94a3b8", fontSize: 10, marginTop: 2 },
  
  featuredCard: { backgroundColor: "white", borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#f1f5f9', shadowColor: "#000", shadowOpacity: 0.05, elevation: 2 },
  featuredImage: { fontSize: 50, textAlign: "center", paddingVertical: 24, backgroundColor: "#f8fafc" },
  sectionBadge: { backgroundColor: "#f1f5f9", color: '#475569', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 12, fontWeight: '600', overflow: 'hidden' },
  xpBadge: { backgroundColor: "#fef3c7", color: '#d97706', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 12, fontWeight: '700', overflow: 'hidden' },
  featuredTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  featuredDesc: { color: "#64748b", marginVertical: 6, fontSize: 14, lineHeight: 20 },
  featuredFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  flexRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { color: '#64748b', fontSize: 13, fontWeight: '500' },
  buttonSm: { flexDirection: "row", backgroundColor: "#4f46e5", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, alignItems: "center" },
  buttonSmText: { color: "white", marginLeft: 4, fontWeight: '600', fontSize: 12 },
  
  exerciseCard: { flexDirection: "row", backgroundColor: "white", borderRadius: 16, padding: 16, marginBottom: 12, alignItems: 'center', shadowColor: "#000", shadowOpacity: 0.03, elevation: 1 },
  exerciseEmoji: { fontSize: 32, marginRight: 16 },
  exerciseTitle: { fontWeight: "700", fontSize: 15, color: "#1e293b" },
  exerciseCategory: { color: "#94a3b8", fontSize: 12, marginBottom: 4 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  playIconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e0e7ff', justifyContent: 'center', alignItems: 'center' },
  
  tipCard: { flexDirection: "row", backgroundColor: "#4f46e5", padding: 16, borderRadius: 16, marginTop: 10, alignItems: 'center' },
  tipIcon: { backgroundColor: "rgba(255,255,255,0.2)", padding: 10, borderRadius: 10, marginRight: 12 },
  tipTitle: { fontWeight: "700", fontSize: 16, color: "white" },
  tipDesc: { color: "#e0e7ff", fontSize: 13, marginTop: 4, lineHeight: 18 },

  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: '#fff', padding: 20 },
  modalHeader: { alignItems: 'flex-end', marginTop: 10 },
  modalContent: { flex: 1, alignItems: 'center', marginTop: 40 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#1e293b' },
  modalCategory: { fontSize: 16, color: '#64748b', marginBottom: 30, textTransform: 'uppercase', letterSpacing: 1 },
  modalBody: { fontSize: 16, color: '#475569', textAlign: 'center', lineHeight: 24, marginBottom: 40, paddingHorizontal: 20 },
  completeButton: { backgroundColor: '#16a34a', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, width: '100%', alignItems: 'center', shadowColor: '#16a34a', shadowOpacity: 0.3, shadowOffset: {width:0, height:4} },
  completeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});