import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

type SwitchProps = {
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (val: boolean) => void;
  disabled?: boolean;
};

export function Switch({
  value,
  defaultValue = false,
  onValueChange,
  disabled = false,
}: SwitchProps) {
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
        styles.root,
        internalValue ? styles.rootChecked : styles.rootUnchecked,
        disabled && styles.rootDisabled,
      ]}
    >
      <View
        style={[
          styles.thumb,
          internalValue ? styles.thumbChecked : styles.thumbUnchecked,
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 32, // equivalente a w-8
    height: 18, // equivalente a h-[1.15rem]
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "transparent",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  rootChecked: {
    backgroundColor: "#007AFF", // equivalente a bg-primary
  },
  rootUnchecked: {
    backgroundColor: "#ccc", // equivalente a bg-switch-background
  },
  rootDisabled: {
    opacity: 0.5,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff", // equivalente a bg-card
    transform: [{ translateX: 0 }],
  },
  thumbChecked: {
    backgroundColor: "#fff",
    transform: [{ translateX: 14 }], // mueve el thumb a la derecha
  },
  thumbUnchecked: {
    backgroundColor: "#fff",
    transform: [{ translateX: 0 }],
  },
});
