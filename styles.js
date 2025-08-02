import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Global
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "#fff" },
  heading: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  sectionHeading: { fontSize: 20, fontWeight: "600", marginTop: 25, marginBottom: 10 },

  // Inputs
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    minHeight: 50,
    backgroundColor: "#f9f9f9",
  },
  iconButton: { marginLeft: 8, padding: 6 },

  // History
  history: { marginTop: 20 },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  group: { marginBottom: 30 },
  dateHeading: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  entryBox: { padding: 10, borderRadius: 6, marginBottom: 8 },
  taskBox: { backgroundColor: "#E6F4EA" },
  thoughtBox: { backgroundColor: "#E8F0FE" },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entryTime: { fontSize: 12, color: "#666" },
  entryText: { fontSize: 16, color: "#333", marginTop: 4 },

  // Picker
  pickerOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" },
  pickerSheet: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  pickerHeaderText: { color: "#0A84FF", fontSize: 16 },
  pickerPreview: { color: "white", fontSize: 16 },
  pickerBody: { backgroundColor: "#1C1C1E" },
});
