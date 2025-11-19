import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Circle } from "lucide-react-native";

type RadioGroupProps = {
  options: { label: string; value: string }[];
  value?: string;
  onValueChange?: (val: string) => void;
};

export function RadioGroup({ options, value, onValueChange }: RadioGroupProps) {
  const [selected, setSelected] = useState(value || "");

  const handleSelect = (val: string) => {
    setSelected(val);
    onValueChange?.(val);
  };

  return (
    <View style={styles.group}>
      {options.map((opt) => (
        <RadioGroupItem
          key={opt.value}
          label={opt.label}
          selected={selected === opt.value}
          onPress={() => handleSelect(opt.value)}
        />
      ))}
    </View>
  );
}

type RadioGroupItemProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function RadioGroupItem({ label, selected, onPress }: RadioGroupItemProps) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={[styles.circle, selected && styles.circleSelected]}>
        {selected && <Circle size={12} color="#007AFF" fill="#007AFF" />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: "column",
    gap: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  circleSelected: {
    borderColor: "#007AFF",
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
});
