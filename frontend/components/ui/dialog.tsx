import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { X } from "lucide-react-native";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      {/* Fondo oscuro */}
      <Pressable
        style={styles.overlay}
        onPress={() => onOpenChange(false)}
      />

      {/* Contenido centrado */}
      <View style={styles.centered}>
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  );
}

export function DialogContent({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <View style={styles.contentBox}>
      {children}

      {/* Botón X */}
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <X size={22} color="#555" />
      </TouchableOpacity>
    </View>
  );
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function DialogDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Text style={styles.description}>{children}</Text>;
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

export function DialogTrigger({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) {
  return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
}

// ✅ ESTILOS — ESTA ES LA PARTE QUE FALTABA
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  centered: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -150 }],
    width: 300,
  },
  content: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 8,
  },
  contentBox: {
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "white",
    padding: 6,
    borderRadius: 20,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  header: {
    marginBottom: 10,
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
});
