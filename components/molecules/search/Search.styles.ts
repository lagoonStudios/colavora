import Colors from "@constants/Colors";
import { Dimensions, StyleSheet } from "react-native";

const ICON_DIMENSIONS = 16;

export const styles = StyleSheet.create({
    textInput: {
        paddingHorizontal: ICON_DIMENSIONS * 2 + 10,

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
});