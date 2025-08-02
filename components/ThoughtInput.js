import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles";

export default function ThoughtInput({ onAddThought }) {
  const [entry, setEntry] = useState("");

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
      <TouchableOpacity onPress={handleAdd} style={styles.iconButton}>
        <Ionicons name="send" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}
