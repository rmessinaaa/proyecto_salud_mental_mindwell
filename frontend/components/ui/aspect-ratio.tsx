// components/AspectRatio.tsx
import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

type AspectRatioProps = {
  ratio?: number; // ej: 16/9, 4/3, 1 (cuadrado)
  children: ReactNode;
};

export function AspectRatio({ ratio = 1, children }: AspectRatioProps) {
  return (
    <View style={[styles.container, { aspectRatio: ratio }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%", // ocupa todo el ancho disponible
    justifyContent: "center",
    alignItems: "center",
  },
});
