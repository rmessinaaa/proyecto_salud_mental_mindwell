import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
} from "react-native";

type TooltipProps = {
  children: React.ReactNode; // trigger
  content: React.ReactNode;  // contenido del tooltip
  delayDuration?: number;
};

export function Tooltip({ children, content, delayDuration = 0 }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  // ✅ solución: ReturnType<typeof setTimeout>
  let timer: ReturnType<typeof setTimeout>;

  const showTooltip = () => {
    timer = setTimeout(() => setVisible(true), delayDuration);
  };

  const hideTooltip = () => {
    clearTimeout(timer);
    setVisible(false);
  };

  return (
    <>
      <Pressable
        onPressIn={showTooltip}
        onPressOut={hideTooltip}
        style={styles.trigger}
      >
        {children}
      </Pressable>

      <Modal transparent visible={visible} animationType="fade">
        <Pressable style={styles.overlay} onPress={hideTooltip}>
          <View style={styles.tooltip}>
            {typeof content === "string" ? (
              <Text style={styles.tooltipText}>{content}</Text>
            ) : (
              content
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tooltip: {
    backgroundColor: "#007AFF", // bg-primary
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    maxWidth: "80%",
  },
  tooltipText: {
    color: "#fff", // text-primary-foreground
    fontSize: 12,
    textAlign: "center",
  },
});
