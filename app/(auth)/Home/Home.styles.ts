import Colors from "@constants/Colors";
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
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderColor: Colors.light.gray.default,
    borderWidth: 1,
    borderRadius: 13,
  },
  description: {
    fontSize: 16,
  },
  counter: {
    fontSize: 24,
  },
  loader: {
    width: 26,
    height: 26,
  },
});

export default styles;
