# 🧠 Mind Dump App

A cross-platform **thought journaling + task planner** built with **React Native** and **Expo**.  
Stores your thoughts and tasks locally with **persistent storage**, and sends **push notifications** for tasks.

---

## 📸 Features
- ✍️ **Mind Dump** section for quick thoughts
- ✅ **Task Planner** with date & time picker
- ⏰ **Push notifications** for tasks
- 📜 Scrollable **History** (grouped by time)
- 💾 Persistent storage with AsyncStorage
- 🎨 Clean, responsive UI with gradient background
- 📱 Works on **iOS** & **Android**

---

## 🚀 Getting Started

### 1️⃣ Clone the repo
```bash
git clone https://github.com/sufiyankureshi688/Project_Journal.git
cd Project_Journal
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Start the app
```bash
npx expo start
```
- Scan the QR code in **Expo Go** app (iOS/Android) to open the app on your phone.

---

## 🛠 Tech Stack
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [React Native DateTimePicker](https://github.com/react-native-datetimepicker/datetimepicker)

---

## 📦 Project Structure
```
/components
  ThoughtInput.js
  TaskInput.js
  HistoryList.js
  TaskPicker.js
/styles.js
App.js
app.json
package.json
```

---

## 📌 Notes
- **Push Notifications** require device testing (won’t work in Expo web preview).
- On iOS, a **paid Apple Developer account** is needed to build a standalone `.ipa` or submit to the App Store.
- Without a paid account, use **Expo Go** or **Expo Dev Client** to test on device.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
