import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  viewContainer: {
    backgroundColor: "rgba(146, 145, 146, 0.7)",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  view: {
    backgroundColor: "white",
    width: 220,
    height: 220,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    paddingVertical: 30,
    borderRadius: 15,
    gap: 20,
  },
  loader: {
    width: 120,
    height: 120,
    transform: [{ scaleX: 3 }, { scaleY: 3 }],
  },
});
