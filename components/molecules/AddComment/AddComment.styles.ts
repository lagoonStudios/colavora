import Colors, { mantisColor } from "@constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  noteTitle: {
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 8,
    fontWeight: 600,
    fontSize: 17,
  },
  providerContainer: {
    display: "flex",
    marginHorizontal: 24,
    gap: 16,
  },
  commnetInput: {
    borderWidth: 0,
    borderColor: "white",
    backgroundColor: Colors.light.gray.default,
    height: 100,
    textAlign: "left",
    textAlignVertical: "top",
    paddingVertical: 10,
  },
  saveButtonContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
  saveButton: {
    backgroundColor: mantisColor,
    fontSize: 10,
  },
});
