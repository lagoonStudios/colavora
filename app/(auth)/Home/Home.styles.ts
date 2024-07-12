import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  description: {
    fontSize: 16,
  },
  counter: {
    fontSize: 24,
  },
});

export default styles;
