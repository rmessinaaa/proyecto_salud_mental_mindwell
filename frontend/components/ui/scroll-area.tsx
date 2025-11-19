import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

type ScrollAreaProps = {
  children: React.ReactNode;
  style?: object;
};

export function ScrollArea({ children, style }: ScrollAreaProps) {
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [contentHeight, setContentHeight] = useState(1);
  const [containerHeight, setContainerHeight] = useState(1);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const ratio = layoutMeasurement.height / contentSize.height;
    const newThumbHeight = Math.max(ratio * layoutMeasurement.height, 20);
    const newThumbTop =
      (contentOffset.y / contentSize.height) * layoutMeasurement.height;
    setThumbHeight(newThumbHeight);
    setThumbTop(newThumbTop);
    setContentHeight(contentSize.height);
    setContainerHeight(layoutMeasurement.height);
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {children}
      </ScrollView>
      {/* ScrollBar visual */}
      <View style={styles.scrollBarTrack}>
        <View
          style={[
            styles.scrollBarThumb,
            { height: thumbHeight, top: thumbTop },
          ]}
        />
      </View>
    </View>
  );
}

export function ScrollBar() {
  // En RN el sistema ya maneja el scroll, este componente es opcional.
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  scrollBarTrack: {
    position: "absolute",
    right: 2,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "transparent",
  },
  scrollBarThumb: {
    position: "absolute",
    width: 4,
    borderRadius: 2,
    backgroundColor: "#999",
  },
});
