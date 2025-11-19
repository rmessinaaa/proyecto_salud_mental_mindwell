import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Controller, useForm, FormProvider } from "react-hook-form";

export function FormField({ name, control, rules, label }: any) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <View style={styles.item}>
          <Text style={[styles.label, fieldState.error && styles.errorLabel]}>
            {label}
          </Text>
          <TextInput
            style={[
              styles.input,
              fieldState.error && { borderColor: "red" },
            ]}
            value={field.value}
            onChangeText={field.onChange}
          />
          {fieldState.error && (
            <Text style={styles.errorMsg}>{fieldState.error.message}</Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  item: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 4 },
  errorLabel: { color: "red" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
  },
  errorMsg: { color: "red", fontSize: 12, marginTop: 4 },
});
