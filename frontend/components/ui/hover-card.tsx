// components/HoverCard.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type HoverCardProps = {
  trigger: React.ReactNode;
  content: React.ReactNode;
};

export function HoverCard({ trigger, content }: HoverCardProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Trigger */}
      <TouchableOpacity
        onPressIn={() => setVisible(true)} // se abre al presionar
        onPressOut={() => setVisible(false)} // se cierra al soltar
      >
        {trigger}
      </TouchableOpacity>

      {/* Content */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.card}>{content}</View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center", // centrado
    alignItems: "center",
    backgroundColor: "transparent",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minWidth: 200,
  },
});
