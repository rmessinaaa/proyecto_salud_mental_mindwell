import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Search } from "lucide-react-native";

interface CommandItemType {
  label: string;
  value: string;
}

interface CommandDialogProps {
  visible: boolean;
  onClose: () => void;
  items: CommandItemType[];
  onSelect: (value: string) => void;
  title?: string;
}

export function CommandDialog({
  visible,
  onClose,
  items,
  onSelect,
  title = "Buscar",
}: CommandDialogProps) {
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <Text style={styles.title}>{title}</Text>

          {/* Input */}
          <View style={styles.searchContainer}>
            <Search size={20} color="#777" />
            <TextInput
              placeholder="Buscar..."
              style={styles.input}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
              >
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>No se encontraron resultados</Text>
            }
          />

          {/* Close button */}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 8,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  itemText: {
    fontSize: 16,
  },
  empty: {
    textAlign: "center",
    paddingVertical: 20,
    color: "#777",
  },
  closeBtn: {
    marginTop: 10,
    padding: 10,
    alignSelf: "center",
  },
  closeText: {
    color: "blue",
    fontSize: 16,
  },
});
