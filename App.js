import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
  Modal,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";

export default function App() {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [task, setTask] = useState("");
  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const [pickerStep, setPickerStep] = useState("date");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [tempTaskText, setTempTaskText] = useState("");

  const STORAGE_KEY = "@mind_dump_entries";

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setEntries(JSON.parse(saved));
    };
    load();
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Enable notifications to receive task alerts.");
      }
    }
  };

  const addThought = () => {
    if (entry.trim()) {
      const newEntry = {
        id: Date.now().toString(),
        text: entry.trim(),
        timestamp: new Date().toISOString(),
        type: "thought",
      };
      setEntries([newEntry, ...entries]);
      setEntry("");
      Keyboard.dismiss();
    }
  };

  const startAddTask = () => {
    if (!task.trim()) return;
    setTempTaskText(task.trim());
    setTask("");
    Keyboard.dismiss();
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setPickerStep("date");
    setShowTaskPicker(true);
  };

  const confirmTask = async () => {
    const finalDate = new Date(selectedDate);
    finalDate.setHours(selectedTime.getHours());
    finalDate.setMinutes(selectedTime.getMinutes());

    const newTask = {
      id: Date.now().toString(),
      text: tempTaskText,
      timestamp: finalDate.toISOString(),
      type: "task",
    };

    setEntries([newTask, ...entries]);
    setTempTaskText("");
    setShowTaskPicker(false);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Task Reminder",
        body: newTask.text,
      },
      trigger: { type: "date", date: finalDate },
    });
  };

  const deleteEntry = (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setEntries((prev) => prev.filter((item) => item.id !== id));
        },
      },
    ]);
  };

  const groupedEntries = entries.reduce((acc, item) => {
    const date = new Date(item.timestamp).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedEntries).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const renderTaskPicker = () => (
    <Modal visible={showTaskPicker} animationType="slide" transparent>
      <View style={styles.pickerOverlay}>
        <View style={styles.pickerSheet}>
          {/* Header */}
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => setShowTaskPicker(false)}>
              <Text style={styles.pickerHeaderText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.pickerPreview}>
              {pickerStep === "date"
                ? selectedDate.toDateString()
                : `${selectedDate.toDateString()} ${selectedTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
            </Text>
            {pickerStep === "date" ? (
              <TouchableOpacity onPress={() => setPickerStep("time")}>
                <Text style={styles.pickerHeaderText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={confirmTask}>
                <Text style={styles.pickerHeaderText}>Confirm</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Picker */}
          <View style={styles.pickerBody}>
            {pickerStep === "date" ? (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                textColor="white"
                onChange={(e, d) => d && setSelectedDate(d)}
                style={{ width: "100%" }}
              />
            ) : (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="spinner"
                textColor="white"
                onChange={(e, t) => t && setSelectedTime(t)}
                style={{ width: "100%" }}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🧠 Mind Dump</Text>

      {/* Thoughts Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          value={entry}
          onChangeText={setEntry}
          multiline
        />
        <TouchableOpacity onPress={addThought} style={styles.iconButton}>
          <Ionicons name="send" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Task Input */}
      <Text style={styles.sectionHeading}>✅ Task Planner</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter a task..."
          value={task}
          onChangeText={setTask}
          multiline
        />
        <TouchableOpacity onPress={startAddTask} style={styles.iconButton}>
          <Ionicons name="calendar" size={24} color="#28A745" />
        </TouchableOpacity>
      </View>

      {/* History */}
      <ScrollView style={styles.history}>
        <Text style={styles.sectionHeading}>📜 History</Text>
        {sortedDates.map((date) => (
          <View key={date} style={styles.group}>
            <Text style={styles.dateHeading}>{date}</Text>
            {groupedEntries[date]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.entryBox,
                    item.type === "task" ? styles.taskBox : styles.thoughtBox,
                  ]}
                >
                  <View style={styles.entryHeader}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={styles.entryTime}>
                        [{new Date(item.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}]
                      </Text>
                      {item.type === "task" && (
                        <FontAwesome
                          name="check-square-o"
                          size={16}
                          color="#28A745"
                          style={{ marginLeft: 6 }}
                        />
                      )}
                    </View>
                    <TouchableOpacity onPress={() => deleteEntry(item.id)}>
                      <MaterialIcons name="delete" size={20} color="#c00" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.entryText}>{item.text}</Text>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>

      {Platform.OS === "ios" && renderTaskPicker()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "#fff" },
  heading: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  sectionHeading: { fontSize: 20, fontWeight: "600", marginTop: 25, marginBottom: 10 },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    minHeight: 50,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
  },
  iconButton: { marginLeft: 8, padding: 6 },
  history: { marginTop: 20 },
  group: { marginBottom: 30 },
  dateHeading: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  entryBox: { padding: 10, borderRadius: 6, marginBottom: 8 },
  taskBox: { backgroundColor: "#E6F4EA" },
  thoughtBox: { backgroundColor: "#E8F0FE" },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entryTime: { fontSize: 12, color: "#666" },
  entryText: { fontSize: 16, color: "#333", marginTop: 4 },
  pickerOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  pickerSheet: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  pickerHeaderText: { color: "#0A84FF", fontSize: 16 },
  pickerPreview: { color: "white", fontSize: 16 },
  pickerBody: { backgroundColor: "#1C1C1E" },
});
