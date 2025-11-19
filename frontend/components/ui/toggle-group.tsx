import React, { createContext, useContext, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type ToggleGroupContextType = {
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline";
};

const ToggleGroupContext = createContext<ToggleGroupContextType>({
  size: "default",
  variant: "default",
});

type ToggleGroupProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline";
  children: React.ReactNode;
};

export function ToggleGroup({
  value,
  defaultValue,
  onValueChange,
  size = "default",
  variant = "default",
  children,
}: ToggleGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const handleChange = (val: string) => {
    setInternalValue(val);
    onValueChange?.(val);
  };

  return (
    <ToggleGroupContext.Provider value={{ size, variant }}>
      <View style={[styles.group, variant === "outline" && styles.groupOutline]}>
        {React.Children.map(children, (child: any) =>
          React.cloneElement(child, {
            active: (value ?? internalValue) === child.props.value,
            onPress: () => handleChange(child.props.value),
          })
        )}
      </View>
    </ToggleGroupContext.Provider>
  );
}

type ToggleGroupItemProps = {
  value: string;
  children: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline";
};

export function ToggleGroupItem({
  value,
  children,
  active,
  onPress,
  size,
  variant,
}: ToggleGroupItemProps) {
  const context = useContext(ToggleGroupContext);
  const appliedSize = size ?? context.size;
  const appliedVariant = variant ?? context.variant;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.item,
        appliedVariant === "outline" && styles.itemOutline,
        active && styles.itemActive,
        appliedSize === "sm" && styles.itemSm,
        appliedSize === "lg" && styles.itemLg,
      ]}
    >
      {typeof children === "string" ? (
        <Text style={[styles.itemText, active && styles.itemTextActive]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    borderRadius: 6,
    alignItems: "center",
  },
  groupOutline: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  item: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "transparent",
  },
  itemOutline: {
    borderColor: "#ccc",
  },
  itemActive: {
    backgroundColor: "#007AFF",
  },
  itemSm: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  itemLg: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 14,
    color: "#333",
  },
  itemTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
});
