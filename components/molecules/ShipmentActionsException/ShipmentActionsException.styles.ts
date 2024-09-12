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
    marginTop: 10,
    gap: 16,
  },
  containerInput: {
    display: "flex",
    gap: 15,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 20,
  },
  saveButton: {
    backgroundColor: mantisColor,
  },
  saveButtonLabel: { fontSize: 14 },
  backButtonLabel: {
    fontSize: 14,
  },
  pickerContainer: {
    borderBlockColor: "black",
    borderWidth: 5,
    backgroundColor: Colors.light.gray.default,
    borderRadius: 40,
  },
});
