import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    padding: 16,
  },
  closeButton: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#33d8d1",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  menuItem: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 8,
  },
  menuItemText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoffButton: {
    padding: 12,
    backgroundColor: "#F50000",
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  logoffButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
