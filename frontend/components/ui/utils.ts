import { StyleProp, ViewStyle, TextStyle, ImageStyle } from "react-native";

type NamedStyles = ViewStyle | TextStyle | ImageStyle;

/**
 * En React Native no necesitamos clsx/tailwind-merge.
 * Simplemente combinamos estilos en un array.
 */
export function cn(...inputs: Array<StyleProp<NamedStyles>>) {
  return inputs.filter(Boolean);
}
