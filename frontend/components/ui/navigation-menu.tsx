import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { ChevronDown } from "lucide-react-native";

export default function AndroidNavigationMenu() {
  const [open, setOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    const toValue = open ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.container}>
      {/* Trigger */}
      <TouchableOpacity style={styles.trigger} onPress={toggleMenu}>
        <Text style={styles.triggerText}>Menú</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <ChevronDown size={16} color="#333" />
        </Animated.View>
      </TouchableOpacity>

      {/* Content */}
      {open && (
        <View style={styles.content}>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Configuración</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    alignItems: "center",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  triggerText: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 6,
  },
  content: {
    marginTop: 10,
    backgroundColor: "#fafafa",
    borderRadius: 6,
    padding: 8,
    width: 200,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  itemText: {
    fontSize: 14,
    color: "#333",
  },
});
