import Colors from "@constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    alignContent: "flex-start",
    flexDirection: "row",
    gap: 10,
    borderColor: "transparent",
    borderWidth: 0,
    backgroundColor: Colors.dark.gray.tint,
    borderRadius: 5,
    padding: 4,
    paddingVertical: 8,
    elevation: 2,
  },
  label: {
    fontWeight: 600,
    textAlignVertical: "center",
    width: "100%",
    overflow: "hidden",
  },
});
