import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingTop: 10,
  },
  bar: {
    backgroundColor: "#33d8d1",
    marginTop: 25,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  historyList: {
    padding: 10,
    flex: 1,
  },
  historyItem: {
    marginBottom: 15,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
  },
  errorContainer: {
    backgroundColor: "#F2F2F2",
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "#ff0000",
    fontSize: 16,
    textAlign: "center",
  },
});

export default styles;
