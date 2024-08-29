import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  companyText: {
    fontSize: 12,
  },
  userText: {
    fontWeight: "700",
    fontSize: 17,
  },
  statusContainer: {
    borderRadius: 10,
    width: 100,
  },
  statusText: {
    textAlign: "center",
    color: "#ffffff",
  },
  infoContainer: {
    display: "flex",
    gap: 1,
  },
  loggedHeaderContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 10,
    height: 70,
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
});
