import React from "react";
import { View, StyleSheet } from "react-native";

type SkeletonProps = {
  style?: object;
};

export function Skeleton({ style }: SkeletonProps) {
  return <View style={[styles.skeleton, style]} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#e0e0e0", // equivalente a bg-accent
    borderRadius: 6,
    height: 16,
    width: "100%",
    // animate-pulse → en RN puedes usar Animated para un efecto shimmer/pulse
  },
});
