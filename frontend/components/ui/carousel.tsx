// components/Carousel.tsx
import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";

const { width } = Dimensions.get("window");

type CarouselProps = {
  data: any[];
  renderItem: ({ item }: { item: any }) => React.ReactElement;
};

export function Carousel({ data, renderItem }: CarouselProps) {
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    setIndex(newIndex);
  };

  const scrollPrev = () => {
    if (index > 0) {
      flatListRef.current?.scrollToIndex({ index: index - 1 });
    }
  };

  const scrollNext = () => {
    if (index < data.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(_, i) => i.toString()}
      />

      {/* Botón anterior */}
      <TouchableOpacity
        style={[styles.button, { left: 10 }]}
        onPress={scrollPrev}
        disabled={index === 0}
      >
        <ArrowLeft size={20} color={index === 0 ? "#aaa" : "#000"} />
      </TouchableOpacity>

      {/* Botón siguiente */}
      <TouchableOpacity
        style={[styles.button, { right: 10 }]}
        onPress={scrollNext}
        disabled={index === data.length - 1}
      >
        <ArrowRight
          size={20}
          color={index === data.length - 1 ? "#aaa" : "#000"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  button: {
    position: "absolute",
    top: "45%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    elevation: 3,
  },
});
