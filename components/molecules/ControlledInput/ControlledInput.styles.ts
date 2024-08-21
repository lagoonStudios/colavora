import { StyleSheet, Platform } from "react-native";

const borderRadius = 10;

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignContent: "flex-start",
    justifyContent: "center",
    borderColor: "transparent",
    borderWidth: 0,
  },
  label: {
    fontSize: 16,
    marginVertical: 4,
  },
  inputContainer: {
    borderWidth: 0.5,
    borderRadius,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderRadius,
    paddingHorizontal: 7,
    height: 40,
  },
  inputShadow: Platform.select({
    ios: {
      shadowOffset: { width: 0, height: 4 },
      shadowColor: "#000",
      shadowOpacity: 0.25,
      borderRadius,
    },
    android: {
      elevation: 3,
      borderRadius,
    },
    default: {},
  }),
  error: {
    marginLeft: 7,
  },
});
