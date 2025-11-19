import React from "react";
import { TextInput, StyleSheet } from "react-native";

type TextareaProps = {
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  style?: object;
  editable?: boolean;
};

export function Textarea({
  value,
  defaultValue,
  onChangeText,
  placeholder,
  style,
  editable = true,
}: TextareaProps) {
  return (
    <TextInput
      style={[styles.textarea, style]}
      value={value}
      defaultValue={defaultValue}
      onChangeText={onChangeText}
      placeholder={placeholder}
      editable={editable}
      multiline
      textAlignVertical="top" // asegura que el texto empiece arriba
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    minHeight: 64, // equivalente a min-h-16
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc", // border-input
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9", // bg-input-background
    color: "#333",
  },
});
