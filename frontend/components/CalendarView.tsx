import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Bell,
  Heart,
  Wind,
  Moon,
  Users,
} from "lucide-react-native";

const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const currentMonth = "Noviembre 2025";

const calendarDays = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  hasActivity: Math.random() > 0.6,
  isToday: i + 1 === 11,
}));

const todaySchedule = [
  {
    time: "08:00",
    title: "Meditación matutina",
    type: "Meditación",
    duration: "10 min",
    icon: Heart,
  },
  {
    time: "12:30",
    title: "Ejercicio de respiración",
    type: "Respiración",
    duration: "5 min",
    icon: Wind,
  },
  {
    time: "18:00",
    title: "Registro emocional",
    type: "Diario",
    duration: "15 min",
    icon: Heart,
  },
  {
    time: "21:00",
    title: "Rutina de sueño",
    type: "Sueño",
    duration: "20 min",
    icon: Moon,
  },
];

const upcomingEvents = [
  { date: "12 Nov", title: "Sesión de meditación grupal", time: "18:00" },
  { date: "14 Nov", title: "Taller: Manejo del estrés", time: "19:00" },
  { date: "15 Nov", title: "Check-in semanal", time: "20:00" },
];

const habitTracking = [
  { habit: "Meditación diaria", streak: 7, goal: 30, icon: "🧘" },
  { habit: "Registro emocional", streak: 12, goal: 30, icon: "📝" },
  { habit: "Ejercicio físico", streak: 4, goal: 21, icon: "🏃" },
  { habit: "8 horas de sueño", streak: 5, goal: 30, icon: "💤" },
];

export default function CalendarView() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(11);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <View>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            Calendario de Bienestar
          </Text>
          <Text style={{ color: "#555" }}>Planifica tus actividades</Text>
        </View>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            backgroundColor: "#a855f7",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Plus size={18} color="white" />
          <Text style={{ color: "white", marginLeft: 6 }}>Nueva</Text>
        </TouchableOpacity>
      </View>

      {/* Calendario */}
      <View
        style={{
          backgroundColor: "white",
          padding: 16,
          borderRadius: 12,
          elevation: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {currentMonth}
          </Text>
        </View>

        {/* Días de semana */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 10,
          }}
        >
          {daysOfWeek.map((d) => (
            <Text
              key={d}
              style={{ color: "#555", width: 40, textAlign: "center" }}
            >
              {d}
            </Text>
          ))}
        </View>

        {/* Días del calendario */}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {calendarDays.map((day) => (
            <TouchableOpacity
              key={day.day}
              onPress={() => setSelectedDay(day.day)}
              style={{
                width: "14.28%",
                aspectRatio: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                backgroundColor: day.isToday
                  ? "#a855f7"
                  : selectedDay === day.day
                  ? "#f3e8ff"
                  : "transparent",
              }}
            >
              <Text
                style={{ color: day.isToday ? "white" : "#333" }}
              >
                {day.day}
              </Text>

              {day.hasActivity && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: "#ec4899",
                    borderRadius: 12,
                    marginTop: 4,
                  }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Actividades del día */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginTop: 24,
          marginBottom: 12,
        }}
      >
        Actividades del día
      </Text>

      {todaySchedule.map((activity, idx) => (
        <View
          key={idx}
          style={{
            backgroundColor: "white",
            padding: 16,
            marginBottom: 12,
            borderRadius: 12,
            elevation: 2,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <activity.icon size={36} color="#a855f7" />

          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {activity.title}
            </Text>
            <Text style={{ color: "#666" }}>
              {activity.time} • {activity.duration}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Bell size={16} />
            <Text style={{ marginLeft: 6 }}>Recordar</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Próximos eventos */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginTop: 24,
          marginBottom: 12,
        }}
      >
        Próximos eventos
      </Text>

      {upcomingEvents.map((event, idx) => (
        <View
          key={idx}
          style={{
            backgroundColor: "white",
            padding: 16,
            marginBottom: 12,
            borderRadius: 12,
            elevation: 2,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{event.date}</Text>
          <Text style={{ fontSize: 16 }}>{event.title}</Text>
          <Text style={{ color: "#666" }}>{event.time}</Text>
        </View>
      ))}

      {/* Hábitos */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginTop: 24,
          marginBottom: 12,
        }}
      >
        Seguimiento de Hábitos
      </Text>

      {habitTracking.map((habit, idx) => (
        <View key={idx} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {habit.icon} {habit.habit}
          </Text>
          <Text style={{ color: "#666" }}>
            {habit.streak}/{habit.goal} días
          </Text>

          <View
            style={{
              width: "100%",
              height: 8,
              backgroundColor: "#ddd",
              borderRadius: 8,
              marginTop: 6,
            }}
          >
            <View
              style={{
                width: `${(habit.streak / habit.goal) * 100}%`,
                height: 8,
                backgroundColor: "#a855f7",
                borderRadius: 8,
              }}
            />
          </View>
        </View>
      ))}

      {/* Botón navegar a settings */}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/explore")}
        style={{
          backgroundColor: "#1d4ed8",
          padding: 14,
          borderRadius: 10,
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Configurar Recordatorios
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
