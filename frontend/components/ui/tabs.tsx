import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type TabsProps = {
  defaultValue?: string;
  children: React.ReactNode;
};

export function Tabs({ defaultValue, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  // Clonamos hijos y pasamos estado
  return (
    <View style={styles.tabs}>
      {React.Children.map(children, (child: any) =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </View>
  );
}

export function TabsList({
  children,
  activeTab,
  setActiveTab,
}: {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (val: string) => void;
}) {
  return <View style={styles.tabsList}>{children}</View>;
}

export function TabsTrigger({
  value,
  children,
  activeTab,
  setActiveTab,
}: {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (val: string) => void;
}) {
  const isActive = activeTab === value;
  return (
    <TouchableOpacity
      style={[styles.tabsTrigger, isActive && styles.tabsTriggerActive]}
      onPress={() => setActiveTab?.(value)}
    >
      {typeof children === "string" ? (
        <Text style={[styles.tabsTriggerText, isActive && styles.tabsTriggerTextActive]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

export function TabsContent({
  value,
  children,
  activeTab,
}: {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
}) {
  if (activeTab !== value) return null;
  return <View style={styles.tabsContent}>{children}</View>;
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "column",
    gap: 8,
  },
  tabsList: {
    flexDirection: "row",
    backgroundColor: "#eee", // bg-muted
    borderRadius: 12,
    padding: 3,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  tabsTrigger: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  tabsTriggerActive: {
    backgroundColor: "#fff", // bg-card
    borderColor: "#ccc",
  },
  tabsTriggerText: {
    fontSize: 14,
    color: "#666",
  },
  tabsTriggerTextActive: {
    color: "#000",
    fontWeight: "600",
  },
  tabsContent: {
    flex: 1,
    marginTop: 8,
  },
});
