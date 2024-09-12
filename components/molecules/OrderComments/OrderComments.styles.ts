import Colors from "@constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 24,
    height: "57%",
  },
  secondaryContainer: {
    display: "flex",
    marginHorizontal: 24,
    gap: 16,
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
    flexDirection: "column",
    gap: 8,
    marginVertical: 5,
    padding: 10,
  },
  title: {
    fontWeight: 600,
    fontSize: 16,
  },
  bodyText: {
    fontWeight: 400,
    fontSize: 14,
  },
  dateText: {
    fontWeight: 300,
    fontSize: 12,
  },
  piecesLabel: {
    marginTop: 4,
    fontWeight: 400,
    fontSize: 12,
    color: Colors.light.noStatus.default,
  },
});
