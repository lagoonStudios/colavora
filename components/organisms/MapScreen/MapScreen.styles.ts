import { StyleSheet, Dimensions } from "react-native";


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    mapStyle: {
        width: Dimensions.get("window").width - 20,
        height: Dimensions.get("window").height - 20,
    },
});