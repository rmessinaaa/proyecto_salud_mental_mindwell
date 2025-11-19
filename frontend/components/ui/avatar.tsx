// components/Avatar.tsx
import React, { ReactNode } from "react";
import { View, Image, Text, StyleSheet } from "react-native";

type AvatarProps = {
  uri?: string;          // URL de la imagen
  fallback?: ReactNode;  // contenido de fallback (ej: iniciales)
  size?: number;         // tamaño del avatar
};

export function Avatar({ uri, fallback, size = 40 }: AvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.fallback, { borderRadius: size / 2 }]}>
          {fallback ?? <Text style={styles.fallbackText}>?</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  fallback: {
    backgroundColor: "#ddd",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
});
