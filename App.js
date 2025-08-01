import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';

export default function App() {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);
  const [task, setTask] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTaskText, setTempTaskText] = useState('');
  const [tempDate, setTempDate] = useState(new Date());

  const STORAGE_KEY = '@mind_dump_entries';

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
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Enable notifications to receive task alerts.');
      }
    }
  };

  const addThought = () => {
    if (entry.trim()) {
      const newEntry = {
        id: Date.now().toString(),
        text: entry.trim(),
        timestamp: new Date().toISOString(),
        type: 'thought',
      };
      setEntries([newEntry, ...entries]);
      setEntry('');
      Keyboard.dismiss();
    }
  };

  const startAddTask = () => {
    if (!task.trim()) return;
    setTempTaskText(task.trim());
    setTask('');
    Keyboard.dismiss();
    setTempDate(new Date());
    setShowDatePicker(true);
  };

  const onDateSelected = (event, selectedDate) => {
    setShowDatePicker(false);
    const finalDate = selectedDate || tempDate;
    setTempDate(finalDate);
    setShowTimePicker(true);
  };

  const onTimeSelected = async (event, selectedTime) => {
    setShowTimePicker(false);
    const finalTime = selectedTime || new Date();

    const combined = new Date(tempDate);
    combined.setHours(finalTime.getHours());
    combined.setMinutes(finalTime.getMinutes());

    const newTask = {
      id: Date.now().toString(),
      text: tempTaskText,
      timestamp: combined.toISOString(),
      type: 'task',
    };

    setEntries([newTask, ...entries]);
    setTempTaskText('');

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Task Reminder',
        body: newTask.text,
      },
      trigger: { type: 'date', date: combined },
    });
  };

  const deleteEntry = (id) => {
    Alert.alert('Delete', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
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

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => new Date(b) - new Date(a));

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🧠 Mind Dump</Text>

      {/* Thought Input */}
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
          <Ionicons name="send" size={24} color="#28A745" />
        </TouchableOpacity>
      </View>

      {/* Date & Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={onDateSelected}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={onTimeSelected}
        />
      )}

      {/* History */}
      <ScrollView style={styles.history}>
        <Text style={styles.sectionHeading}>📜 History</Text>
        {sortedDates.map((date) => (
          <View key={date} style={styles.group}>
            <Text style={styles.dateHeading}>{date}</Text>
            {groupedEntries[date]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((item) => (
                <View key={item.id} style={styles.entryBox}>
                  <View style={styles.entryHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.entryTime}>
                        [{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]
                      </Text>
                      {item.type === 'task' && (
                        <FontAwesome name="check-square-o" size={16} color="#28A745" style={{ marginLeft: 6 }} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  heading: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  sectionHeading: { fontSize: 20, fontWeight: '600', marginTop: 25, marginBottom: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    minHeight: 50,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
  iconButton: {
    marginLeft: 8,
    padding: 6,
  },
  history: { marginTop: 20 },
  group: { marginBottom: 30 },
  dateHeading: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  entryBox: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryTime: { fontSize: 12, color: '#666' },
  entryText: { fontSize: 16, color: '#333', marginTop: 4 },
});
