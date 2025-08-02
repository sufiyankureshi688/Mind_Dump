import React, { useState, useEffect } from "react";
import { View, Text, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import styles from "./styles";
import ThoughtInput from "./components/ThoughtInput";
import TaskInput from "./components/TaskInput";
import HistoryList from "./components/HistoryList";
import TaskPicker from "./components/TaskPicker";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [showTaskPicker, setShowTaskPicker] = useState(false);
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
    setEntries([newEntry, ...entries]);
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

    setEntries([newTask, ...entries]);
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
    <View style={styles.container}>
      <Text style={styles.heading}>🧠 Mind Dump</Text>

      <ThoughtInput onAddThought={addThought} />
      <TaskInput taskText={taskText} setTaskText={setTaskText} onStartAddTask={startAddTask} />
      <HistoryList entries={entries} onDelete={deleteEntry} onClearAll={clearAllEntries} />

      {Platform.OS === "ios" && (
        <TaskPicker
          visible={showTaskPicker}
          setVisible={setShowTaskPicker}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          onConfirm={confirmTask}
        />
      )}
    </View>
  );
}
