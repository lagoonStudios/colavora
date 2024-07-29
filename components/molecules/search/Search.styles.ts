import Colors from "@constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    search: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.light.gray.default,
        backgroundColor: Colors.light.background.default,
    },
    dropdown: {
        borderColor: Colors.light.gray.default,
        borderWidth: 2
    },
    searchTextInput: {
        borderColor: Colors.light.gray.default,
        borderWidth: 1
    },
    searchContainer: {
        borderColor: Colors.light.gray.default,
    },
    listItemContainer: {
        borderTopColor: Colors.light.gray.default,
        borderTopWidth: 1
    }

});