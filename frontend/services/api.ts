import AsyncStorage from '@react-native-async-storage/async-storage';

// ==========================================
// CONFIGURACIÓN DE RED
// ==========================================
// ⚠️ Asegúrate de que esta IP sea la correcta de tu PC
const API_URL = 'http://192.168.1.81:8000/api';

// ==========================================
// INTERFACES
// ==========================================

export interface RegistroDiario {
  id?: number;
  emocion: string; // 'feliz', 'triste', etc.
  nota: string;
  nivel_intensidad: number;
  nivel_energia?: number;
  actividades?: string; // Django lo guarda como texto ej: "Trabajo,Gym"
  fecha?: string; // YYYY-MM-DD
  hora?: string;  // HH:MM:SS
}

// ✅ Nueva interfaz para Recordatorios
export interface Recordatorio {
  id?: number;
  titulo: string;
  fecha_hora: string; // ISO String
  tipo: string;
  completado?: boolean;
}

export interface UserProfile {
  username: string;
  email: string;
  biografia: string;
  avatar_url?: string;
  notificaciones_diarias: boolean;
  tema_oscuro: boolean;
  nivel_actual: number;
  es_premium: boolean;
  experiencia_actual?: number;
  experiencia_siguiente_nivel?: number;
}

export interface AuthResponse {
  token: string;
  id: number;
}

// Interfaces Gamificación
export interface Logro {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
  rareza: 'Común' | 'Raro' | 'Épico' | 'Legendario';
  puntos: number;
  es_secreto: boolean;
  pista?: string;
  fecha_obtenido?: string; 
}

export interface LogrosResponse {
  desbloqueados: Logro[];
  bloqueados: Logro[];
  puntos_totales: number;
}

// ==========================================
// HELPER: Headers
// ==========================================
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Token ${token}` } : {}),
  };
};

// ==========================================
// API OBJECT
// ==========================================
export const api = {

  // -------------------------
  // 1. AUTH (LOGIN / REGISTRO)
  // -------------------------
  registrarUsuario: async (userData: { username: string; email: string; password: string }) => {
    try {
      const url = `${API_URL}/auth/registro/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error registro:", error);
      throw error;
    }
  },

  login: async (credentials: { username: string; password: string }): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Credenciales inválidas");
      }

      const data = await response.json();
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userId', String(data.id));
      return data;
    } catch (error) {
      console.error("Error login:", error);
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
  },

  // -------------------------
  // 2. PERFIL
  // -------------------------
  getPerfil: async (): Promise<UserProfile | null> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/auth/perfil/`, { method: 'GET', headers });

      if (response.status === 401) throw new Error("Token vencido");
      if (!response.ok) throw new Error("Error al obtener perfil");

      return await response.json();
    } catch (error) {
      console.error("Error perfil:", error);
      return null;
    }
  },

  updatePerfil: async (datos: Partial<UserProfile>) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/auth/perfil/`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(datos),
      });

      if (!response.ok) throw new Error("Error actualizando perfil");
      return await response.json();
    } catch (error) {
      console.error("Error update perfil:", error);
      throw error;
    }
  },

  // -------------------------
  // 3. DIARIO
  // -------------------------
  getRegistros: async (): Promise<RegistroDiario[]> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/seguimiento/diario/`, { headers });
      
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error obteniendo diario:", error);
      return []; 
    }
  },

  crearRegistro: async (datos: RegistroDiario): Promise<RegistroDiario | null> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/seguimiento/diario/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error server:", errorBody);
        throw new Error('No se pudo guardar el registro');
      }

      return await response.json();
    } catch (error) {
      console.error("Error creando registro:", error);
      throw error;
    }
  },

  // -------------------------
  // 4. ESTADÍSTICAS
  // -------------------------
  getStats: async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/seguimiento/stats/`, { headers });
      
      if (!response.ok) throw new Error("Error obteniendo estadísticas");
      return await response.json();
    } catch (error) {
      console.error("Error stats:", error);
      return null;
    }
  },

  // -------------------------
  // 5. GAMIFICACIÓN (Logros)
  // -------------------------
  registrarAccion: async (tipo: string, xp: number) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/gamificacion/accion/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ tipo, xp }),
      });

      if (!response.ok) throw new Error("Error registrando acción");
      return await response.json();
    } catch (error) {
      console.error("Error accion:", error);
      return null;
    }
  },

  getLogros: async (): Promise<LogrosResponse | null> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/gamificacion/logros/`, { headers });
      
      if (!response.ok) throw new Error("Error obteniendo logros");
      return await response.json();
    } catch (error) {
      console.error("Error logros:", error);
      return null;
    }
  },

  // -------------------------
  // 6. RECORDATORIOS (CALENDARIO) ✅ AGREGADO
  // -------------------------
  getRecordatorios: async (): Promise<Recordatorio[]> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/seguimiento/recordatorios/`, { headers });
      if (!response.ok) throw new Error("Error obteniendo recordatorios");
      return await response.json();
    } catch (error) {
      console.error("Error getRecordatorios:", error);
      return [];
    }
  },

  crearRecordatorio: async (datos: { titulo: string; fecha_hora: string; tipo: string }) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/seguimiento/recordatorios/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const txt = await response.text();
        console.error("Error server:", txt);
        throw new Error("No se pudo crear el recordatorio");
      }
      return await response.json();
    } catch (error) {
      console.error("Error crearRecordatorio:", error);
      throw error;
    }
  },

  eliminarRecordatorio: async (id: number) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/seguimiento/recordatorios/${id}/`, {
        method: 'DELETE',
        headers: headers,
      });

      if (!response.ok) throw new Error("No se pudo eliminar");
      return true; // Retornamos true si fue exitoso
    } catch (error) {
      console.error("Error eliminarRecordatorio:", error);
      return false;
    }
  },

};