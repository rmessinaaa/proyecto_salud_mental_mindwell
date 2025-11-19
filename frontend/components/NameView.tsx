import { View, Text, StyleSheet } from 'react-native';

export default function NameView({ categoryName }: { categoryName?: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categoría: {categoryName}</Text>
      <Text>Aquí irían todos los recursos de {categoryName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
});
