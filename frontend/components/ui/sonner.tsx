import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

type ToastMessage = {
  id: number;
  text: string;
};

type ToasterProps = {
  messages: ToastMessage[];
  duration?: number;
  onRemove: (id: number) => void;
};

export function Toaster({ messages, duration = 3000, onRemove }: ToasterProps) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    if (messages.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          if (messages[0]) {
            onRemove(messages[0].id);
          }
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <View style={styles.toast}>
        <Text style={styles.toastText}>{messages[0].text}</Text>
      </View>
    </Animated.View>
  );
}

// Hook para disparar toasts desde cualquier parte
let showToastFn: ((text: string) => void) | null = null;

export function useToast() {
  return {
    show: (text: string) => {
      showToastFn?.(text);
    },
  };
}

// Wrapper para proveer el Toaster
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  showToastFn = (text: string) => {
    setMessages((prev) => [...prev, { id: Date.now(), text }]);
  };

  const removeMessage = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <>
      {children}
      <Toaster messages={messages} onRemove={removeMessage} />
    </>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  toast: {
    backgroundColor: "#333", // equivalente a var(--popover)
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  toastText: {
    color: "#fff", // equivalente a var(--popover-foreground)
    fontSize: 14,
  },
});
