// components/Checkbox.tsx
import React, { useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";

type CheckboxProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
};

export function Checkbox({ checked = false, onChange, disabled }: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const toggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <Pressable
      onPress={toggle}
      disabled={disabled}
      style={[
        styles.box,
        isChecked && styles.boxChecked,
        disabled && styles.boxDisabled,
      ]}
    >
      {isChecked && <Check size={14} color="#fff" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  boxChecked: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  boxDisabled: {
    opacity: 0.5,
  },
});
