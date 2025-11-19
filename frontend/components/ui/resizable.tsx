import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import { GripVertical } from "lucide-react-native";

type ResizablePanelGroupProps = {
  direction?: "horizontal" | "vertical";
  children: React.ReactNode[];
};

export function ResizablePanelGroup({
  direction = "horizontal",
  children,
}: ResizablePanelGroupProps) {
  const [sizes, setSizes] = useState([50, 50]); // porcentaje inicial
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (direction === "horizontal") {
          const totalWidth = 100;
          let newSize = sizes[0] + (gestureState.dx / 300) * 100; // ajustar divisor
          newSize = Math.max(10, Math.min(90, newSize));
          setSizes([newSize, totalWidth - newSize]);
        } else {
          const totalHeight = 100;
          let newSize = sizes[0] + (gestureState.dy / 500) * 100;
          newSize = Math.max(10, Math.min(90, newSize));
          setSizes([newSize, totalHeight - newSize]);
        }
      },
    })
  ).current;

  return (
    <View
      style={[
        styles.group,
        direction === "vertical" ? styles.vertical : styles.horizontal,
      ]}
    >
      <View
        style={[
          styles.panel,
          direction === "horizontal"
            ? { width: `${sizes[0]}%` }
            : { height: `${sizes[0]}%` },
        ]}
      >
        {children[0]}
      </View>

      <ResizableHandle panResponder={panResponder} direction={direction} />

      <View
        style={[
          styles.panel,
          direction === "horizontal"
            ? { width: `${sizes[1]}%` }
            : { height: `${sizes[1]}%` },
        ]}
      >
        {children[1]}
      </View>
    </View>
  );
}

function ResizableHandle({
  panResponder,
  direction,
}: {
  panResponder: any;
  direction: "horizontal" | "vertical";
}) {
  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.handle,
        direction === "vertical" ? styles.handleVertical : styles.handleHorizontal,
      ]}
    >
      <GripVertical size={16} color="#666" />
    </View>
  );
}

export function ResizablePanel({ children }: { children: React.ReactNode }) {
  return <View style={styles.panel}>{children}</View>;
}

const styles = StyleSheet.create({
  group: {
    flex: 1,
  },
  horizontal: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  vertical: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },
  panel: {
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  handle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
  },
  handleHorizontal: {
    width: 10,
    height: "100%",
  },
  handleVertical: {
    height: 10,
    width: "100%",
  },
});
