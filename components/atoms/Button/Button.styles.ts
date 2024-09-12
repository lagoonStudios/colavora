import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {},
  buttonShadow: Platform.select({
    ios: {
      shadowOffset: { width: 0, height: 4 },
      shadowColor: "#000",
      shadowOpacity: 0.25,
      borderRadius: 8,
    },
    android: {
      elevation: 3,
      borderRadius: 8,
    },
    default: {},
  }),
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: "600",
    fontSize: 18,
  },
});
