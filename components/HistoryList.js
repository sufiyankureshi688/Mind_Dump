import React, { useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Animated } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import styles from "../styles";

export default function HistoryList({ entries, onDelete, onClearAll }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [entries.length]);

  const confirmClearAll = () => {
    Alert.alert(
      "Clear All History",
      "Are you sure you want to delete all history? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: onClearAll },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "600", marginRight: 6 }}>📜 History</Text>
        {entries.length > 0 && (
          <TouchableOpacity onPress={confirmClearAll}>
            <MaterialIcons name="delete-forever" size={22} color="#c00" />
          </TouchableOpacity>
        )}
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
          keyboardShouldPersistTaps="handled"
        >
          {entries.map((item) => (
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
                <TouchableOpacity onPress={() => onDelete(item.id)}>
                  <MaterialIcons name="delete" size={20} color="#c00" />
                </TouchableOpacity>
              </View>
              <Text style={styles.entryText}>{item.text}</Text>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
