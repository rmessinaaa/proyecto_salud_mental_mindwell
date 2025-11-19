// components/Badge.tsx
import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";

type BadgeProps = {
  variant?: "default" | "secondary" | "destructive" | "outline";
  children: ReactNode;
};

export function Badge({ variant = "default", children }: BadgeProps) {
  return (
    <View
      style={[
        styles.base,
        variant === "default" && styles.default,
        variant === "secondary" && styles.secondary,
        variant === "destructive" && styles.destructive,
        variant === "outline" && styles.outline,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "outline" && styles.outlineText,
          variant === "destructive" && styles.destructiveText,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
  default: {
    backgroundColor: "#007AFF", // primary
    borderColor: "transparent",
  },
  secondary: {
    backgroundColor: "#eee",
    borderColor: "transparent",
  },
  destructive: {
    backgroundColor: "#FF3B30",
    borderColor: "transparent",
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: "#333",
  },
  outlineText: {
    color: "#333",
  },
  destructiveText: {
    color: "#fff",
  },
});
