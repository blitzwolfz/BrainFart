import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Alert, View, TouchableWithoutFeedback, Keyboard, PanResponder } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/ui/Button';

const moodOptions = [
    { color: '#FF0000', emoji: '😡', description: 'Very Angry' },
    { color: '#FF4500', emoji: '😠', description: 'Angry' },
    { color: '#FF8C00', emoji: '😟', description: 'Worried' },
    { color: '#FFA500', emoji: '😐', description: 'Neutral' },
    { color: '#FFD700', emoji: '🙂', description: 'Slightly Happy' },
    { color: '#ADFF2F', emoji: '😊', description: 'Happy' },
    { color: '#32CD32', emoji: '😀', description: 'Very Happy' },
    { color: '#008000', emoji: '😃', description: 'Excited' },
    { color: '#006400', emoji: '😁', description: 'Elated' },
];

export default function MoodTracker() {
    const [selectedMood, setSelectedMood] = useState(null);
    const [currentTime, setCurrentTime] = useState('');
    const [thoughts, setThoughts] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert to 12-hour format
            setCurrentTime(`${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            const index = Math.floor((gestureState.moveX / 350) * moodOptions.length);
            if (index >= 0 && index < moodOptions.length) {
                setSelectedMood(moodOptions[index]);
            }
        },
    });

    const handleSubmit = () => {
        if (!selectedMood) {
            Alert.alert('Error', 'Please select a mood before submitting.');
            return;
        }

        Alert.alert('Success', 'Mood entry saved!');
        setSelectedMood(null);
        setThoughts('');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ThemedView style={styles.container}>
                <ThemedText type="title" style={styles.centerText}>How are you feeling today?</ThemedText>
                <ThemedText type="subtitle" style={styles.timeText}>{currentTime}</ThemedText>
                <View style={styles.moodBarContainer} {...panResponder.panHandlers}>
                    {moodOptions.map((mood, index) => (
                        <View
                            key={index}
                            style={[styles.moodBar, { backgroundColor: mood.color, opacity: selectedMood?.color === mood.color ? 1 : 0.5 }]}
                        />
                    ))}
                </View>
                {selectedMood && (
                    <ThemedText style={styles.selectedMoodText}>{selectedMood.emoji} {selectedMood.description}</ThemedText>
                )}
                <ThemedView style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Write down your thoughts..."
                        placeholderTextColor="#AAA"
                        multiline
                        value={thoughts}
                        onChangeText={setThoughts}
                    />
                </ThemedView>
                <Button onPress={handleSubmit} style={styles.submitButton}>
                    <ThemedText>Submit</ThemedText>
                </Button>
            </ThemedView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    centerText: {
        textAlign: 'center',
        marginBottom: 20,
    },
    moodBarContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        width: 350,
        height: 50,
    },
    moodBar: {
        flex: 1,
        height: '100%',
    },
    selectedMoodText: {
        fontSize: 20,
        marginBottom: 10,
    },
    inputContainer: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 8,
        width: '90%',
    },
    input: {
        padding: 10,
        fontSize: 16,
        minHeight: 80,
        color: '#FFF',
        backgroundColor: 'transparent',
    },
    submitButton: {
        marginTop: 20,
        alignSelf: 'center',
    },
});
