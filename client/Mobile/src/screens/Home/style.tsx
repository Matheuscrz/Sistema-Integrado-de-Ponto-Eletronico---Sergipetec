import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 10,
  },
  infoBox: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: "80%",
    alignSelf: "center",
  },
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userSector: {
    fontSize: 12,
    marginLeft: 5,
  },
  mapContainer: {
    flex: 0.8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  dateTime: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
  },
  registerButton: {
    backgroundColor: "#33d8d1",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  menuButton: {
    padding: 10,
    borderRadius: 5,
  },
});

export default styles;
