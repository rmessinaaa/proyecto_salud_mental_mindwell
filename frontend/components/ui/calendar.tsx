import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AndroidCalendar() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Seleccionar fecha" onPress={() => setShow(true)} />

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="calendar" // Android soporta "calendar" y "spinner"
          onChange={(event, selectedDate) => {
            setShow(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={{ marginTop: 20 }}>
        Fecha seleccionada: {date.toDateString()}
      </Text>
    </View>
  );
}
