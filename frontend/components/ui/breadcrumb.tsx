// components/Breadcrumb.tsx
import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link, type Href } from "expo-router";
import { ChevronRight, MoreHorizontal } from "lucide-react-native";

export function Breadcrumb({ children }: { children: ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

export function BreadcrumbList({ children }: { children: ReactNode }) {
  return <View style={styles.list}>{children}</View>;
}

export function BreadcrumbItem({ children }: { children: ReactNode }) {
  return <View style={styles.item}>{children}</View>;
}

export function BreadcrumbLink({
  href,
  children,
  replace,
}: {
  href: Href; // ✅ tipo correcto para Expo Router
  children: ReactNode;
  replace?: boolean; // opcional si quieres reemplazar en vez de push
}) {
  return (
    <Link href={href} replace={replace} asChild>
      <TouchableOpacity accessibilityRole="link">
        <Text style={styles.link}>{children}</Text>
      </TouchableOpacity>
    </Link>
  );
}

export function BreadcrumbPage({ children }: { children: ReactNode }) {
  return <Text style={styles.page}>{children}</Text>;
}

export function BreadcrumbSeparator() {
  return (
    <View style={styles.separator}>
      <ChevronRight size={14} color="#666" />
    </View>
  );
}

export function BreadcrumbEllipsis() {
  return (
    <View style={styles.ellipsis}>
      <MoreHorizontal size={16} color="#666" />
      <Text style={styles.srOnly}>More</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  link: {
    color: "#007AFF",
    fontSize: 14,
  },
  page: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
  },
  separator: {
    marginHorizontal: 4,
  },
  ellipsis: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  srOnly: {
    position: "absolute",
    opacity: 0,
  },
});
