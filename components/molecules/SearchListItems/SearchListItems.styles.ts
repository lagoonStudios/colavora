import Colors from "@constants/Colors";
import { StyleSheet } from "react-native";

const ICON_DIMENSIONS = 16;

export const styles = StyleSheet.create({
    dataContainer: {
        width: "100%",
        height: "100%",
        minHeight: ICON_DIMENSIONS * 2,
        paddingHorizontal: 10,
        paddingVertical: 16,
    },
    containerLabel: {
        fontSize: 16,
        color: Colors.light.noStatus.default
    },
    listItemContainer: {
        paddingVertical: 10,
    },
    listItemSeparator: {
        borderWidth: 1,
        borderColor: Colors.light.gray.default,
        marginVertical: 8
    },
    contentText: {
        fontSize: 16,
        color: Colors.light.text.default
    }
});