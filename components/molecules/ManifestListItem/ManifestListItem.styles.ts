import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 14,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        paddingVertical: 25,
        gap: 16,
    },
    descriptionContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    description: {
        fontSize: 16,
    },
    count: {
        fontSize: 20,
        fontWeight: '300',
    },
});
