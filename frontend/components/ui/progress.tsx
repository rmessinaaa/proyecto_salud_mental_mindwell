import React from "react";
import { View, StyleSheet } from "react-native";

type ProgressProps = {
  value?: number; // porcentaje 0-100
  style?: object;
};

export function Progress({ value = 0, style }: ProgressProps) {
  return (
    <View style={[styles.root, style]}>
      <View style={[styles.indicator, { width: `${value}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 8,
    width: "100%",
    backgroundColor: "rgba(0, 122, 255, 0.2)", // equivalente a bg-primary/20
    borderRadius: 4,
    overflow: "hidden",
  },
  indicator: {
    height: "100%",
    backgroundColor: "#007AFF", // equivalente a bg-primary
    borderRadius: 4,
  },
});
