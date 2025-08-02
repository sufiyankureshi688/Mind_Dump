import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // Card wrapper for each section
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  // Headings
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },

  // Input row
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  iconButton: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },

  // History
  entryBox: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  thoughtBox: {
    backgroundColor: "#EAF4FF",
  },
  taskBox: {
    backgroundColor: "#E9F9EE",
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  entryTime: {
    fontSize: 12,
    color: "#555",
  },
  entryText: {
    fontSize: 16,
    color: "#333",
  },

  // History date heading
  dateHeading: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#666",
  },

  // History section header row
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Group spacing
  group: {
    marginBottom: 12,
  },
});
