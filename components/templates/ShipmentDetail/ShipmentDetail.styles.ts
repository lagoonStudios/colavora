import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 24,
        alignContent: "center",
    },
    infoContainer: {
        flex: 1,
        gap: 24,
        alignContent: "center",
        marginBottom: 24
    },
    mapContainer: {
        height: "45%",
        maxHeight: 500
    },
    section: {
        gap: 6,
        borderRadius: 13,
        marginHorizontal: "auto",
        width: "70%"
    },
    textHeader: {
        fontWeight: 600,
        fontSize: 16,
    },
    textSubtitle: {
        fontWeight: 600,
        fontSize: 14,
    },
    textBody: {
        fontWeight: 600,
        fontSize: 12,
    }

});