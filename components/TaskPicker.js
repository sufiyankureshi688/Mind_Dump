import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../styles";

export default function TaskPicker({
  visible,
  setVisible,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onConfirm,
}) {
  const [step, setStep] = useState("date");

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.pickerOverlay}>
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.pickerHeaderText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.pickerPreview}>
              {step === "date"
                ? selectedDate.toDateString()
                : `${selectedDate.toDateString()} ${selectedTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
            </Text>
            {step === "date" ? (
              <TouchableOpacity onPress={() => setStep("time")}>
                <Text style={styles.pickerHeaderText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onConfirm}>
                <Text style={styles.pickerHeaderText}>Confirm</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.pickerBody}>
            {step === "date" ? (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                textColor="white"
                onChange={(e, d) => d && setSelectedDate(d)}
              />
            ) : (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="spinner"
                textColor="white"
                onChange={(e, t) => t && setSelectedTime(t)}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
