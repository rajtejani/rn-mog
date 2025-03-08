import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome } from "@expo/vector-icons";

const CustomDatePicker = ({
  onDateSelected,
}: {
  onDateSelected: (date: Date) => void;
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleDateString("en-GB")
  );

  const getCurrentDate = () => {
    const now = new Date();
    now.setHours(23, 59, 59, 999); // Set to end of day for inclusive comparison
    return now;
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date: Date) => {
    const formattedDate = date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
    setSelectedDate(formattedDate);
    onDateSelected(date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.inputContainer} onPress={showDatePicker}>
        <Text style={styles.inputText}>{selectedDate}</Text>
        <FontAwesome name="calendar" size={20} color="#000" />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        maximumDate={getCurrentDate()}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", marginTop: 10, marginBottom: 10 },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  inputText: {
    fontSize: 16,
    color: "#888",
  },
});

export default CustomDatePicker;
