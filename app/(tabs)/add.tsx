import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Alert, View, TouchableWithoutFeedback, Keyboard, PanResponder } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/ui/Button';
import {moodOptions} from "@/utils/mood";
import * as SQLite from 'expo-sqlite';

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
                //@ts-ignore
                setSelectedMood(moodOptions[index]);
            }
        },
    });

    const handleSubmit = () => {
        if (!selectedMood) {
            Alert.alert('Error', 'Please select a mood before submitting.');
            const db = SQLite.openDatabaseSync('moods')
            const allRows = db.getAllSync('SELECT * FROM moods');

            console.log(allRows);
            return;
        }

        else {
            try {
                const db = SQLite.openDatabaseSync('moods')
                db.execSync(
                    `INSERT INTO moods (id, value, description) VALUES (${Math.floor(Date.now() / 1000)}, ${selectedMood.value}, '${thoughts.replace(/'/g, "''")}');`
                );
            }
            catch (error) {
                if (error instanceof Error) {
                    Alert.alert('Error', error.message);
                    console.log(error.message);
                    console.log('E');
                }

                else Alert.alert('Error', 'An error occurred.');
                return;
            }
            finally {
                Alert.alert('Success', 'Mood entry saved!');
                setSelectedMood(null);
                setThoughts('');
            }

        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ThemedView style={styles.container}>
                <ThemedText type="title" style={styles.centerText}>How are you feeling today?</ThemedText>
                <ThemedText type="subtitle">{currentTime}</ThemedText>
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
