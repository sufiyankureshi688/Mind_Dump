import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import styles from "./styles";
import ThoughtInput from "./components/ThoughtInput";
import TaskInput from "./components/TaskInput";
import HistoryList from "./components/HistoryList";
import TaskPicker from "./components/TaskPicker";

function MainApp() {
  const insets = useSafeAreaInsets();

  const [entries, setEntries] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [tempTaskText, setTempTaskText] = useState("");

  const STORAGE_KEY = "@mind_dump_entries";

  // Load saved entries
  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setEntries(JSON.parse(saved));
    };
    load();
    registerForPushNotificationsAsync();
  }, []);

  // Save on change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
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

  const addThought = (text) => {
    const newEntry = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toISOString(),
      type: "thought",
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const startAddTask = (text) => {
    setTempTaskText(text);
    setSelectedDate(new Date());
    setSelectedTime(new Date());
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

    setEntries((prev) => [newTask, ...prev]);
    setTempTaskText("");
    setShowTaskPicker(false);

    await Notifications.scheduleNotificationAsync({
      content: { title: "⏰ Task Reminder", body: newTask.text },
      trigger: { type: "date", date: finalDate },
    });
  };

  const deleteEntry = (id) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllEntries = () => {
    setEntries([]);
    AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Background gradient */}
      <LinearGradient
        colors={["#E6F0FF", "#FFFFFF"]}
        style={{ flex: 1, position: "absolute", width: "100%", height: "100%" }}
      />

      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        {/* Mind Dump Section */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.card}>
            <Text style={styles.heading}>🧠 Mind Dump</Text>
            <ThoughtInput onAddThought={addThought} />
          </View>
        </TouchableWithoutFeedback>

        {/* Task Planner Section */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>✅ Task Planner</Text>
            <TaskInput
              taskText={taskText}
              setTaskText={setTaskText}
              onStartAddTask={startAddTask}
            />
          </View>
        </TouchableWithoutFeedback>

        {/* History Section */}
        <View
          style={[
            styles.card,
            {
              flex: 1, // Fill remaining space
              overflow: "hidden",
            },
          ]}
        >
          <HistoryList
            entries={entries}
            onDelete={deleteEntry}
            onClearAll={clearAllEntries}
          />
        </View>

        {/* TaskPicker Modal */}
        <TaskPicker
          visible={showTaskPicker}
          setVisible={setShowTaskPicker}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          onConfirm={confirmTask}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}
