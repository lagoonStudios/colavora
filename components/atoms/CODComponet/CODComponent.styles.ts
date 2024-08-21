import Colors, { mantisColor } from "@constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  viewContainer: {
    backgroundColor: "rgba(146, 145, 146, 0.4)",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  view: {
    backgroundColor: "white",
    width: 300,
    height: "auto",
    display: "flex",
    padding: 25,
    paddingVertical: 30,
    gap: 15,
  },
  addCOD: {
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 8,
    fontWeight: 600,
    fontSize: 17,
  },
  picker: {
    backgroundColor: Colors.dark.gray.tint,
  },
  textInput: {
    width: "85%",
  },
  icon: {
    marginLeft: 5,
    borderWidth: 2,
    borderRadius: 20,
    height: 23,
    width: 23,
    textAlign: "center",
    textAlignVertical: "center",
  },
  iconSecondary: {
    marginLeft: 2,
    height: 23,
    width: 23,
    textAlign: "center",
    textAlignVertical: "center",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 5,
  },
  cancelButton: {
    padding: 8,
    paddingHorizontal: 22,
    borderRadius: 10,
    backgroundColor: "rgba(245, 39, 13, 0.8)",
    color: Colors.light.text.contrast,
  },
  addButton: {
    padding: 8,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: mantisColor,
    color: Colors.light.text.contrast,
  },
});
