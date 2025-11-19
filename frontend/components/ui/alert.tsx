// components/Alert.tsx
import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";

type AlertProps = {
  variant?: "default" | "destructive";
  children: ReactNode;
};

export function Alert({ variant = "default", children }: AlertProps) {
  return (
    <View
      style={[
        styles.base,
        variant === "default" && styles.default,
        variant === "destructive" && styles.destructive,
      ]}
    >
      {children}
    </View>
  );
}

export function AlertTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function AlertDescription({ children }: { children: ReactNode }) {
  return <Text style={styles.description}>{children}</Text>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
  },
  default: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
  },
  destructive: {
    backgroundColor: "#fff",
    borderColor: "#f00",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
});
