import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type ToggleProps = {
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (val: boolean) => void;
  disabled?: boolean;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  children?: React.ReactNode;
};

export function Toggle({
  value,
  defaultValue = false,
  onValueChange,
  disabled = false,
  variant = "default",
  size = "default",
  children,
}: ToggleProps) {
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);

  const toggle = () => {
    if (disabled) return;
    const newVal = !internalValue;
    setInternalValue(newVal);
    onValueChange?.(newVal);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggle}
      disabled={disabled}
      style={[
        styles.base,
        variant === "outline" && styles.outline,
        size === "sm" && styles.sm,
        size === "lg" && styles.lg,
        internalValue && styles.active,
        disabled && styles.disabled,
      ]}
    >
      {typeof children === "string" ? (
        <Text style={[styles.text, internalValue && styles.textActive]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    paddingHorizontal: 8,
    minWidth: 36,
    height: 36,
    backgroundColor: "transparent",
  },
  outline: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  sm: {
    height: 32,
    minWidth: 32,
    paddingHorizontal: 6,
  },
  lg: {
    height: 40,
    minWidth: 40,
    paddingHorizontal: 10,
  },
  active: {
    backgroundColor: "#007AFF", // equivalente a bg-accent
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  textActive: {
    color: "#fff", // equivalente a text-accent-foreground
    fontWeight: "600",
  },
});
