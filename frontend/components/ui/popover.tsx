import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";

type PopoverProps = {
  triggerLabel: string;
  children: React.ReactNode;
};

export function Popover({ triggerLabel, children }: PopoverProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Trigger */}
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.triggerText}>{triggerLabel}</Text>
      </TouchableOpacity>

      {/* Content */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.content}>
            {children}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export function PopoverTrigger({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.trigger} onPress={onPress}>
      <Text style={styles.triggerText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function PopoverContent({ children }: { children: React.ReactNode }) {
  return <View style={styles.content}>{children}</View>;
}

export function PopoverAnchor({ children }: { children: React.ReactNode }) {
  return <View style={styles.anchor}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  trigger: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  triggerText: {
    fontSize: 16,
    color: "#333",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: 250,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  anchor: {
    marginTop: 10,
  },
});
