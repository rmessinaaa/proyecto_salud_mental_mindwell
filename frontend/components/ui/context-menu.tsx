// components/ContextMenu.tsx
import React, { useState, ReactNode } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type ContextMenuProps = {
  options: { label: string; onPress: () => void; destructive?: boolean }[];
  children: ReactNode; // trigger
};

export function ContextMenu({ options, children }: ContextMenuProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Trigger */}
      <TouchableOpacity onLongPress={() => setVisible(true)}>
        {children}
      </TouchableOpacity>

      {/* Context Menu */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.menu}>
            {options.map((opt, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.item,
                  opt.destructive && { backgroundColor: "#fee" },
                ]}
                onPress={() => {
                  setVisible(false);
                  opt.onPress();
                }}
              >
                <Text
                  style={[
                    styles.label,
                    opt.destructive && { color: "red" },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.item, { backgroundColor: "#eee" }]}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.label}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    minWidth: 200,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
  },
  label: {
    fontSize: 16,
  },
});
