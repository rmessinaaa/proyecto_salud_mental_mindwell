import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { X } from "lucide-react-native";

type SheetProps = {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  triggerLabel?: string;
};

export function Sheet({ children, side = "right", triggerLabel = "Abrir" }: SheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      {/* Trigger */}
      <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)}>
        <Text style={styles.triggerText}>{triggerLabel}</Text>
      </TouchableOpacity>

      {/* Content */}
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <View
            style={[
              styles.content,
              side === "right" && styles.right,
              side === "left" && styles.left,
              side === "top" && styles.top,
              side === "bottom" && styles.bottom,
            ]}
          >
            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setOpen(false)}
            >
              <X size={20} color="#333" />
            </TouchableOpacity>

            {children}
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function SheetHeader({ children }: { children: React.ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

export function SheetFooter({ children }: { children: React.ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

export function SheetTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function SheetDescription({ children }: { children: React.ReactNode }) {
  return <Text style={styles.description}>{children}</Text>;
}

const styles = StyleSheet.create({
  trigger: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  triggerText: {
    fontSize: 16,
    color: "#333",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    width: "80%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  right: {
    alignSelf: "flex-end",
    height: "100%",
  },
  left: {
    alignSelf: "flex-start",
    height: "100%",
  },
  top: {
    alignSelf: "flex-start",
    width: "100%",
  },
  bottom: {
    alignSelf: "flex-end",
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6,
  },
  header: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});
