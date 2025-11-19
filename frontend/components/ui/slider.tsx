import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";

type SliderProps = {
  min?: number;
  max?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (val: number) => void;
};

export function Slider({
  min = 0,
  max = 100,
  value,
  defaultValue = min,
  onValueChange,
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);
  const sliderWidth = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (sliderWidth.current > 0) {
          const ratio = Math.min(
            Math.max(gestureState.moveX / sliderWidth.current, 0),
            1
          );
          const newValue = min + ratio * (max - min);
          setInternalValue(newValue);
          onValueChange?.(Math.round(newValue));
        }
      },
    })
  ).current;

  const progress = ((internalValue - min) / (max - min)) * 100;

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        sliderWidth.current = e.nativeEvent.layout.width;
      }}
    >
      <View style={styles.track}>
        <View style={[styles.range, { width: `${progress}%` }]} />
      </View>
      <View
        style={[styles.thumb, { left: `${progress}%` }]}
        {...panResponder.panHandlers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd", // equivalente a bg-muted
    overflow: "hidden",
  },
  range: {
    height: "100%",
    backgroundColor: "#007AFF", // equivalente a bg-primary
  },
  thumb: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff", // equivalente a bg-background
    borderWidth: 2,
    borderColor: "#007AFF", // equivalente a border-primary
    top: 10,
    marginLeft: -10, // centra el thumb
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
