import Colors from "@constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: Colors.light.gray.default,
        borderRadius: 13,
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 8,
        marginVertical: 14,
        marginHorizontal: 20,
        padding: 16,
    },
    title: {
        fontWeight: 600,
        fontSize: 16,
    },
    bodyText: {
        fontWeight: 600,
        fontSize: 14,
    },
    piecesLabel: {
        fontWeight: 400,
        fontSize: 12,
        color: Colors.light.noStatus.default,
    }
});