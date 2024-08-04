import Colors from "@constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
  },
  noteTitle: {
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 8,
    fontWeight: 600,
    fontSize: 17,
  },
  notesContainer: {
    borderWidth: 1,
    borderColor: Colors.light.gray.default,
    borderRadius: 13,
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 8,
    marginVertical: 10,
    padding: 16,
  },
  title: {
    fontWeight: 600,
    fontSize: 16,
  },
  bodyText: {
    fontWeight: 400,
    fontSize: 14,
  },
  piecesLabel: {
    marginTop: 4,
    fontWeight: 400,
    fontSize: 12,
    color: Colors.light.noStatus.default,
  },
});
