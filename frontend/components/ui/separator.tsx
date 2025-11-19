import React from "react";
import { View, StyleSheet, AccessibilityRole } from "react-native";

type SeparatorProps = {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  style?: object;
};

export function Separator({
  orientation = "horizontal",
  decorative = true,
  style,
}: SeparatorProps) {
  // En RN no existe "separator" como AccessibilityRole
  const role: AccessibilityRole | undefined = decorative ? undefined : "none";

  return (
    <View
      accessibilityRole={role}
      style={[
        orientation === "horizontal" ? styles.horizontal : styles.vertical,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
    backgroundColor: "#ccc", // equivalente a bg-border
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    height: "100%",
    backgroundColor: "#ccc",
  },
});
