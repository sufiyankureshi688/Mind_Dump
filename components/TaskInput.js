import React, { useRef } from "react";
import { View, TextInput, TouchableOpacity, Keyboard, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles";

export default function TaskInput({ taskText, setTaskText, onStartAddTask }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleAddTask = () => {
    if (!taskText.trim()) return;
    onStartAddTask(taskText.trim());
    setTaskText("");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        placeholder="Task..."
        value={taskText}
        onChangeText={setTaskText}
        multiline
      />
      <TouchableOpacity
        onPressIn={animatePress}
        onPress={handleAddTask}
        style={styles.iconButton}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons name="send" size={24} color="#28A745" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}
