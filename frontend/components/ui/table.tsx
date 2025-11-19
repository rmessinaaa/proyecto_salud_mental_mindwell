import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

type TableProps = {
  children?: React.ReactNode;
};

export function Table({ children }: TableProps) {
  return (
    <ScrollView horizontal style={styles.tableContainer}>
      <View style={styles.table}>{children}</View>
    </ScrollView>
  );
}

export function TableHeader({ children }: { children?: React.ReactNode }) {
  return <View style={styles.tableHeader}>{children}</View>;
}

export function TableBody({ children }: { children?: React.ReactNode }) {
  return <View style={styles.tableBody}>{children}</View>;
}

export function TableFooter({ children }: { children?: React.ReactNode }) {
  return <View style={styles.tableFooter}>{children}</View>;
}

export function TableRow({ children }: { children?: React.ReactNode }) {
  return <View style={styles.tableRow}>{children}</View>;
}

export function TableHead({ children }: { children?: React.ReactNode }) {
  return (
    <View style={styles.tableHead}>
      {typeof children === "string" ? <Text style={styles.tableHeadText}>{children}</Text> : children}
    </View>
  );
}

export function TableCell({ children }: { children?: React.ReactNode }) {
  return (
    <View style={styles.tableCell}>
      {typeof children === "string" ? <Text style={styles.tableCellText}>{children}</Text> : children}
    </View>
  );
}

export function TableCaption({ children }: { children?: React.ReactNode }) {
  return (
    <Text style={styles.tableCaption}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    width: "100%",
  },
  table: {
    flexDirection: "column",
    width: "100%",
  },
  tableHeader: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
  },
  tableBody: {
    flexDirection: "column",
  },
  tableFooter: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  tableHead: {
    flex: 1,
    padding: 8,
    justifyContent: "center",
  },
  tableHeadText: {
    fontWeight: "600",
    color: "#222",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    justifyContent: "center",
  },
  tableCellText: {
    color: "#333",
  },
  tableCaption: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
