import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  companyText: {
    fontSize: 14,
  },
  userText: {
    fontWeight: "700",
    fontSize: 17,
  },
  statusText: {
    backgroundColor: "#7EC074",
    width: 100,
    textAlign: "center",
    borderRadius: 10,
    color: "#ffffff",
  },
  infoContainer: {
    display: "flex",
    gap: 1,
    backgroundColor: "trasnparent",
  },
  loggedHeaderContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 10,
    backgroundColor: "trasnparent",
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    backgroundColor: "trasnparent",
  },
});
