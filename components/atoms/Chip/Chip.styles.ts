import Colors from "@constants/Colors";
import { StyleSheet } from "react-native";

const textSize = 12;

export const styles = StyleSheet.create({
    container: {
        borderRadius: textSize + textSize / 2,
        paddingHorizontal: textSize,
        paddingVertical: textSize / 2,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    active: {
        borderWidth: 1,
        borderColor: Colors.light.primary.default,
    },
    inactive: {
        borderWidth: 1,
        borderColor: Colors.light.lightGray.default,
    },
    label: {
        fontSize: textSize,
        fontWeight: 400,
    }
});