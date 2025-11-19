import * as React from "react";
import { View } from "react-native";
import { Menu, Button } from "react-native-paper";

export default function MenubarExample() {
  const [visible, setVisible] = React.useState(false);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={<Button onPress={() => setVisible(true)}>Abrir Menú</Button>}
      >
        <Menu.Item onPress={() => {}} title="Opción 1" />
        <Menu.Item onPress={() => {}} title="Opción 2" />
        <Menu.Item
          onPress={() => {}}
          title="Eliminar"
          titleStyle={{ color: "red" }} // ✅ correcto
        />
      </Menu>
    </View>
  );
}
