import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';

export default function MoodEntryCard({ mood, emoji, description, color, onDelete }) {
    return (
        <View style={[styles.card, { backgroundColor: color }]}>
            <ThemedText style={styles.text}>{emoji} {description}</ThemedText>
            <Button onPress={onDelete}>Delete</Button>
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
    }
});