import Colors, { mantisColor } from "@constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  addCOD: {
    backgroundColor: mantisColor,
    paddingHorizontal: 25,
    paddingVertical: 5,
    borderRadius: 10,
    width: 120,
  },
  addCODText: {
    color: Colors.light.text.contrast,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 15,
  },
  viewItemsContainer: {
    gap: 5,
  },
  viewItems: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  textItem: {
    fontSize: 15,
    fontWeight: 600,
  },
});
