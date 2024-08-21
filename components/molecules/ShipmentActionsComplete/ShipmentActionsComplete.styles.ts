import Colors, { mantisColor } from "@constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  completeTitle: {
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 8,
    fontWeight: 600,
    fontSize: 17,
  },
  providerContainer: {
    display: "flex",
    marginHorizontal: 24,
    marginTop: 10,
    gap: 16,
  },
  formContainer: {
    display: "flex",
    gap: 15,
  },
  textInput: {
    width: "90%",
  },
  saveButtonContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
  saveButton: {
    backgroundColor: mantisColor,
    paddingHorizontal: 25,
    paddingVertical: 5,
    borderRadius: 10,
    width: "auto",
  },
  saveButtonText: {
    color: Colors.light.text.contrast,
  },
});
