// app/(tabs)/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // Esto le dice a la app: "Apenas entres aquí, redirige al dashboard"
  return <Redirect href="/dashboard" />;
}