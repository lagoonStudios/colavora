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
    marginBottom: 20,
    flex: 1
  },
  formContainer: {
    display: "flex",
    gap: 15,
    flex: 1
  },
  textInput: {
    width: "90%",
  },
  saveButtonContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flexDirection: "row",
    gap: 11,
  },
  saveButton: {
    backgroundColor: mantisColor,
  },
  saveButtonLabel: { fontSize: 14 },
  cancelButton: {
    backgroundColor: "rgba(245, 39, 13, 0.8)",
  },
  cancelButtonLabel: { fontSize: 14 },
  saveButtonText: {
    color: Colors.light.text.contrast,
  },
  backButtonLabel: {
    fontSize: 14
  },
  commnetInput: {
    textAlign: "left",
    textAlignVertical: "center",
  },
});
