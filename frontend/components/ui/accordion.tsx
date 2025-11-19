// components/Accordion.tsx
import React, { useState, ReactNode } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { ChevronDown } from "lucide-react-native"; // versión RN del icono

type AccordionItemProps = {
  title: string;
  children: ReactNode;
};

export function AccordionItem({ title, children }: AccordionItemProps) {
  const [open, setOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleAccordion = () => {
    const finalValue = open ? 0 : 1;
    Animated.timing(animation, {
      toValue: finalValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setOpen(!open);
  };

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], // ajusta según contenido
  });

  return (
    <View style={styles.item}>
      <TouchableOpacity style={styles.trigger} onPress={toggleAccordion}>
        <Text style={styles.title}>{title}</Text>
        <Animated.View
          style={{
            transform: [
              {
                rotate: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "180deg"],
                }),
              },
            ],
          }}
        >
          <ChevronDown size={20} color="#666" />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={{ overflow: "hidden", height }}>
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    paddingVertical: 8,
  },
});
