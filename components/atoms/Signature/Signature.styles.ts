import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "auto",
    display: "flex",
    gap: 10,
    flex: 1,
    maxHeight: 300
  },
  title: {
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 8,
    fontWeight: 600,
    fontSize: 14,
  },
  signatureBox: { borderWidth: 0.5, borderColor: "black", height: "auto" }
});
