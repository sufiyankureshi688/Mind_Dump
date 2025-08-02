import React, { useState, useRef } from "react";
import { View, TextInput, TouchableOpacity, Keyboard, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles";

export default function ThoughtInput({ onAddThought }) {
  const [entry, setEntry] = useState("");
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleAdd = () => {
    if (!entry.trim()) return;
    onAddThought(entry.trim());
    setEntry("");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={entry}
        onChangeText={setEntry}
        multiline
      />
      <TouchableOpacity
        onPressIn={animatePress}
        onPress={handleAdd}
        style={styles.iconButton}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons name="send" size={24} color="#007AFF" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}
