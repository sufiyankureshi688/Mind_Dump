import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles";

export default function TaskInput({ taskText, setTaskText, onStartAddTask }) {
  return (
    <>
      <Text style={styles.sectionHeading}>✅ Task Planner</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter a task..."
          value={taskText}
          onChangeText={setTaskText}
          multiline
        />
        <TouchableOpacity
          onPress={() => taskText.trim() && onStartAddTask(taskText.trim())}
          style={styles.iconButton}
        >
          <Ionicons name="calendar" size={24} color="#28A745" />
        </TouchableOpacity>
      </View>
    </>
  );
}
