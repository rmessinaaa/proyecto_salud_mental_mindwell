import { View, Text, StyleSheet } from "react-native";

export default function CommunityView() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comunidad</Text>
      <Text style={styles.subtitle}>
        Conecta con otras personas y comparte tu progreso.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fafafa",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    color: "#111",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
