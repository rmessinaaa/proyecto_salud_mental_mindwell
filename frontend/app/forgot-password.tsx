import { Stack } from "expo-router";
// Asegúrate de que el archivo exista en esta ruta exacta:
import ForgotPasswordView from "../components/ForgotPasswordView";

export default function ForgotPasswordScreen() {
  return (
    <>
      {/* Ocultamos la barra de navegación nativa para usar la nuestra */}
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Renderizamos el componente visual */}
      <ForgotPasswordView />
    </>
  );
}