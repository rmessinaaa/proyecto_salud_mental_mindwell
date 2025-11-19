// components/InputOTP.tsx
import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

type InputOTPProps = {
  length?: number;
  onChange?: (value: string) => void;
};

export function InputOTP({ length = 6, onChange }: InputOTPProps) {
  const [values, setValues] = useState(Array(length).fill(""));

  const handleChange = (text: string, index: number) => {
    const newValues = [...values];
    newValues[index] = text.slice(-1); // solo último carácter
    setValues(newValues);
    onChange?.(newValues.join(""));
  };

  return (
    <View style={styles.container}>
      {values.map((val, i) => (
        <TextInput
          key={i}
          style={styles.slot}
          value={val}
          onChangeText={(text) => handleChange(text, i)}
          keyboardType="number-pad"
          maxLength={1}
        />
      ))}
    </View>
  );
}

export function InputOTPSeparator() {
  return <Text style={styles.separator}>-</Text>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  slot: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    textAlign: "center",
    fontSize: 18,
  },
  separator: {
    fontSize: 20,
    marginHorizontal: 4,
  },
});
