// components/Button.tsx
import React, { ReactNode } from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

type ButtonProps = {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
};

export function Button({
  variant = "default",
  size = "default",
  children,
  onPress,
  disabled,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, sizeStyles[size], variantStyles[variant], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, textVariantStyles[variant]]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
  disabled: {
    opacity: 0.5,
  },
});

const sizeStyles: Record<string, ViewStyle> = {
  default: { height: 36, paddingHorizontal: 16, paddingVertical: 8 },
  sm: { height: 32, paddingHorizontal: 12, paddingVertical: 6 },
  lg: { height: 40, paddingHorizontal: 20, paddingVertical: 10 },
  icon: { width: 36, height: 36 },
};

const variantStyles: Record<string, ViewStyle> = {
  default: { backgroundColor: "#007AFF" },
  destructive: { backgroundColor: "#FF3B30" },
  outline: { borderWidth: 1, borderColor: "#333", backgroundColor: "transparent" },
  secondary: { backgroundColor: "#eee" },
  ghost: { backgroundColor: "transparent" },
  link: { backgroundColor: "transparent" },
};

const textVariantStyles: Record<string, TextStyle> = {
  default: { color: "#fff" },
  destructive: { color: "#fff" },
  outline: { color: "#333" },
  secondary: { color: "#000" },
  ghost: { color: "#007AFF" },
  link: { color: "#007AFF", textDecorationLine: "underline" },
};
