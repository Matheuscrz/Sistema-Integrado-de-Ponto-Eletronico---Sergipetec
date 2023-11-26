import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: width,
  },
  logo: {
    flex: 1,
    height: height * 0.25, // Altura reduzida
    width: width * 0.8,
    alignSelf: "center",
    marginVertical: 10,
    marginLeft: "auto",
    marginRight: "auto",
  },
  input: {
    height: 48,
    width: width * 0.75,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 18,
    borderColor: "black",
    borderWidth: 1,
    marginLeft: "auto",
    marginRight: "auto",
    alignSelf: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.75,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 16,
    backgroundColor: "white",
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1,
    marginLeft: "auto",
    marginRight: "auto",
    alignSelf: "center",
  },
  passwordInput: {
    flex: 1,
    height: 48,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "transparent",
  },
  showPasswordButton: {
    padding: 10,
  },
  showPasswordText: {
    color: "#33d8d1",
  },
  button: {
    backgroundColor: "#33d8d1",
    marginTop: 10,
    height: height * 0.05,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.5,
    marginLeft: "auto",
    marginRight: "auto",
    alignSelf: "center",
  },
  buttonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#2e2e2d",
  },
  footerLink: {
    color: "#33d8d1",
    fontWeight: "bold",
    fontSize: 16,
  },
  checkboxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    marginLeft: 0,
  },
  checkboxText: {
    fontSize: 16,
    color: "#2e2e2d",
  },
});

export default styles;
