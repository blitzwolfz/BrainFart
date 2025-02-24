import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as SQLite from 'expo-sqlite';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MoodEntryCard from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { moodOptions } from "@/utils/mood";

export default function MoodCalendarScreen() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [entries, setEntries] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const db = SQLite.openDatabaseSync('moods', { useNewConnection: true });

    useEffect(() => {
        loadMarkedDates();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            loadEntries(selectedDate);
        } else {
            setEntries([]); // Clear entries when no date is selected
        }
    }, [selectedDate]);

    const loadMarkedDates = () => {
        const result = db.getAllSync('SELECT id FROM moods;');
        let marks = {};
        result.forEach(row => {
            const formattedDate = new Date(row.id).toISOString().split('T')[0]; // Convert UNIX timestamp to ISO date
            marks[formattedDate] = { marked: true, dotColor: 'red' };
        });
        setMarkedDates(marks);
    };

    const loadEntries = (date) => {
        const startTimestamp = Math.floor(new Date(date).setHours(0, 0, 0, 0) / 1000);
        const endTimestamp = Math.floor(new Date(date).setHours(23, 59, 59, 999) / 1000);

        const result = db.getAllSync(`SELECT * FROM moods WHERE id BETWEEN ${startTimestamp} AND ${endTimestamp};`);
        setEntries(result);
    };

    const deleteEntry = (id) => {
        db.execSync(`DELETE FROM moods WHERE id = ${id};`);
        Alert.alert('Deleted', 'Mood entry deleted successfully.');
        loadEntries(selectedDate);
        loadMarkedDates();
    };

    return (
        <ThemedView style={{ flex: 1, padding: 16 }}>
            <Calendar
                markedDates={markedDates}
                onDayPress={day => setSelectedDate(day.dateString)}
            />
            {selectedDate && (
                <>
                    <ThemedText type="title" style={{ marginTop: 16 }}>
                        Entries for {selectedDate}
                    </ThemedText>
                    <FlatList
                        data={entries}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => {
                            const moodEntry = moodOptions.find(x => x.value === item.mood);
                            return (
                                <MoodEntryCard
                                    mood={moodEntry?.description || "Unknown Mood"}
                                    emoji={moodEntry?.emoji || "❓"}
                                    description={item.description}
                                    color="yellow"
                                    onDelete={() => deleteEntry(item.id)}
                                >
                                    <ThemedText>{moodEntry?.emoji} {item.description}</ThemedText>
                                    <Button onPress={() => deleteEntry(item.id)}>Delete</Button>
                                </MoodEntryCard>
                            );
                        }}
                    />
                </>
            )}
        </ThemedView>
    );
}
