import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Button({ onPress, style, children }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={styles.text}>{children}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
