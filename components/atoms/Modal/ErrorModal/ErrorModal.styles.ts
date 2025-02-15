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
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    width: 300,
    height: 80,
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
  },
  view: {
    backgroundColor: "white",
    display: "flex",
    gap: 7,
    width: 300,
    maxHeight: 200,
    paddingVertical: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  scrollContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  viewDataContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  text: {
    textAlign: "justify",
    fontSize: 13,
    flex: 1,
  },
  textError: {
    textAlign: "center",
    color: "red",
  },
  textView: {
    paddingHorizontal: 25,
    flex: 1,
  },
  closeContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  closeText: {
    textAlign: "center",
    backgroundColor: "red",
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: 20,
    color: "white",
  },
  pressableButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  textPressable: {
    color: "red",
  },
});
