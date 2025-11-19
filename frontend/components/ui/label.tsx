// components/Label.tsx
import React from "react";
import { Text, StyleSheet } from "react-native";

type LabelProps = {
  children: React.ReactNode;
  disabled?: boolean;
};

export function Label({ children, disabled }: LabelProps) {
  return (
    <Text style={[styles.label, disabled && styles.disabled]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  disabled: {
    opacity: 0.5,
  },
});
