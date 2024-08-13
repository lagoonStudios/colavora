import { StyleSheet } from "react-native";

const textSize = 15;

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
    marginHorizontal: 20,
    gap: 15,
  },
  item: {
    height: 40,
    borderRadius: textSize + textSize / 15,
    paddingHorizontal: textSize,
    paddingVertical: textSize / 2,
    width: "100%",
    alignContent: "center",
    textAlignVertical: "center",
  },
  label: {
    fontSize: textSize,
    textAlign: "left",
  },
});
