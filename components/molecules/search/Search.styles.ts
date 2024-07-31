import Colors from "@constants/Colors";
import { Dimensions, StyleSheet } from "react-native";

const ICON_DIMENSIONS = 16;

export const styles = StyleSheet.create({
    container: {
        position: "relative",
        zIndex: 1,
    },
    textInput: {
        paddingHorizontal: ICON_DIMENSIONS * 2 + 10
    },
    leftIcon: {
        position: "absolute",
        width: ICON_DIMENSIONS,
        height: "100%",
        left: ICON_DIMENSIONS,
        marginVertical: 10,
        fontSize: ICON_DIMENSIONS
    },
    rightIcon: {
        position: "absolute",
        width: ICON_DIMENSIONS,
        height: "100%",
        right: ICON_DIMENSIONS,
        marginVertical: 10,
        fontSize: ICON_DIMENSIONS
    },
    dataContainer: {
        position: "absolute",
        zIndex: 10,
        width: "100%",
        height: "auto",
        maxHeight: Dimensions.get("window").height / 2,
        minHeight: ICON_DIMENSIONS * 2,
        paddingHorizontal: 10,
        paddingVertical: 16,
        borderWidth: 2,
        borderColor: Colors.light.gray.default,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        elevation: 10,
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