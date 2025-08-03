import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import stylesGlobal from "../styles";

export default function TaskPicker({
  visible,
  setVisible,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onConfirm,
}) {
  const [mode, setMode] = useState("date");
  const [tempDate, setTempDate] = useState(selectedDate);
  const [tempTime, setTempTime] = useState(selectedTime);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setTempDate(selectedDate);
      setTempTime(selectedTime);
      setMode("date");
      setShowPicker(true);
    }
  }, [visible]);

  const handleAndroidDateChange = (event, value) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      setVisible(false);
      return;
    }
    setTempDate(value || tempDate);
    setShowPicker(false);

    // Open time picker after date
    setTimeout(() => {
      setMode("time");
      setShowPicker(true);
    }, 100);
  };

  const handleAndroidTimeChange = (event, value) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      setVisible(false);
      return;
    }
    setTempTime(value || tempTime);
    setShowPicker(false);
    confirmSelection(value || tempTime);
  };

  const handleIOSChange = (event, value) => {
    if (mode === "date") {
      setTempDate(value || tempDate);
    } else {
      setTempTime(value || tempTime);
    }
  };

  const confirmSelection = () => {
    setSelectedDate(tempDate);
    setSelectedTime(tempTime);
    setVisible(false);
    onConfirm();
  };

  if (Platform.OS === "android" && showPicker) {
    return (
      <DateTimePicker
        value={mode === "date" ? tempDate : tempTime}
        mode={mode}
        onChange={mode === "date" ? handleAndroidDateChange : handleAndroidTimeChange}
      />
    );
  }

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {mode === "date" ? "Select Date" : "Select Time"}
          </Text>

          <DateTimePicker
            value={mode === "date" ? tempDate : tempTime}
            mode={mode}
            display="spinner"
            onChange={handleIOSChange}
            style={{ width: "100%" }}
          />

          {Platform.OS === "ios" && (
            <View style={styles.btnRow}>
              <TouchableOpacity
                onPress={() => setMode(mode === "date" ? "time" : "date")}
                style={[styles.btn, { backgroundColor: "#007AFF" }]}
              >
                <Text style={styles.btnText}>
                  {mode === "date" ? "Time" : "Date"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmSelection}
                style={[styles.btn, { backgroundColor: "#28A745" }]}
              >
                <Text style={styles.btnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity onPress={() => setVisible(false)} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  btnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelBtn: {
    marginTop: 10,
  },
  cancelText: {
    color: "#007AFF",
    fontSize: 16,
  },
});
