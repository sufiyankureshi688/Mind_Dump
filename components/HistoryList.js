import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import styles from "../styles";

export default function HistoryList({ entries, onDelete, onClearAll }) {
  const groupedEntries = entries.reduce((acc, item) => {
    const date = new Date(item.timestamp).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedEntries).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <ScrollView style={styles.history}>
      <View style={styles.historyHeader}>
        <Text style={styles.sectionHeading}>📜 History</Text>
        {entries.length > 0 && (
          <TouchableOpacity onPress={onClearAll}>
            <MaterialIcons name="delete-forever" size={20} color="#c00" />
          </TouchableOpacity>
        )}
      </View>

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
                  <TouchableOpacity onPress={() => onDelete(item.id)}>
                    <MaterialIcons name="delete" size={20} color="#c00" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.entryText}>{item.text}</Text>
              </View>
            ))}
        </View>
      ))}
    </ScrollView>
  );
}
