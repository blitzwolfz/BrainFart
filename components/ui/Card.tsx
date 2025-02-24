import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function MoodEntryCard({ mood, emoji, description, color }) {
    return (
        <View style={[styles.card, { backgroundColor: color }]}>
            <ThemedText style={styles.text}>{emoji} {mood}</ThemedText>
            {description && <ThemedText style={styles.text}>{description}</ThemedText>}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    text: {
        fontSize: 16,
        marginBottom: 8,
        color: "black"
    }
});
