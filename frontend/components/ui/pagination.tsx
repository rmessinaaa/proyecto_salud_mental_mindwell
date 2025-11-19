import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react-native";

type PaginationLinkProps = {
  isActive?: boolean;
  label?: string;
  onPress?: () => void;
};

export function Pagination() {
  return (
    <View style={styles.container}>
      <PaginationPrevious onPress={() => console.log("Prev")} />
      <PaginationContent>
        <PaginationItem>
          <PaginationLink label="1" isActive onPress={() => console.log("Page 1")} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink label="2" onPress={() => console.log("Page 2")} />
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink label="10" onPress={() => console.log("Page 10")} />
        </PaginationItem>
      </PaginationContent>
      <PaginationNext onPress={() => console.log("Next")} />
    </View>
  );
}

function PaginationContent({ children }: { children: React.ReactNode }) {
  return <View style={styles.content}>{children}</View>;
}

function PaginationItem({ children }: { children: React.ReactNode }) {
  return <View style={styles.item}>{children}</View>;
}

function PaginationLink({ isActive, label, onPress }: PaginationLinkProps) {
  return (
    <TouchableOpacity
      style={[styles.link, isActive && styles.activeLink]}
      onPress={onPress}
    >
      <Text style={[styles.linkText, isActive && styles.activeText]}>{label}</Text>
    </TouchableOpacity>
  );
}

function PaginationPrevious({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.navButton} onPress={onPress}>
      <ChevronLeft size={18} color="#333" />
      <Text style={styles.navText}>Previous</Text>
    </TouchableOpacity>
  );
}

function PaginationNext({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.navButton} onPress={onPress}>
      <Text style={styles.navText}>Next</Text>
      <ChevronRight size={18} color="#333" />
    </TouchableOpacity>
  );
}

function PaginationEllipsis() {
  return (
    <View style={styles.ellipsis}>
      <MoreHorizontal size={18} color="#666" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 10,
  },
  item: {
    marginHorizontal: 4,
  },
  link: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#eee",
  },
  activeLink: {
    backgroundColor: "#ddd",
    borderWidth: 1,
    borderColor: "#333",
  },
  linkText: {
    fontSize: 14,
    color: "#333",
  },
  activeText: {
    fontWeight: "bold",
    color: "#000",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
  },
  navText: {
    fontSize: 14,
    marginHorizontal: 4,
    color: "#333",
  },
  ellipsis: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
