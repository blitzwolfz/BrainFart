import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import * as SQLite from 'expo-sqlite';
import * as Localization from 'expo-localization';
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
        const marks = {};

        result.forEach(row => {
            const localDate = convertToLocalDate(row.id * 1000);
            console.log("Marked Date:", localDate);
            marks[localDate] = { marked: true, dotColor: 'red' };
        });

        setMarkedDates(marks);
    };

    const loadEntries = (date) => {
        const startTimestamp = convertToTimestamp(date, "start");
        const endTimestamp = convertToTimestamp(date, "end");

        console.log("Loading entries for:", date, "Start:", startTimestamp, "End:", endTimestamp);

        const result = db.getAllSync(`SELECT * FROM moods WHERE id BETWEEN ${startTimestamp} AND ${endTimestamp};`);
        setEntries(result);
    };

    const deleteEntry = (id) => {
        db.execSync(`DELETE FROM moods WHERE id = ${id};`);
        Alert.alert('Deleted', 'Mood entry deleted successfully.');
        loadEntries(selectedDate);
        loadMarkedDates();
    };

    /**
     * Convert timestamp to local date string based on device timezone.
     */
    const convertToLocalDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString(Localization.locale, { year: "numeric", month: "2-digit", day: "2-digit" }).split('/').reverse().join('-'); // Adjust for YYYY-MM-DD format
    };

    /**
     * Convert a date string (YYYY-MM-DD) to a UNIX timestamp.
     */
    const convertToTimestamp = (date, type) => {
        const localDate = new Date(date + "T00:00:00");
        if (type === "end") {
            localDate.setHours(23, 59, 59, 999);
        }
        return Math.floor(localDate.getTime() / 1000);
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            <ThemedView style={{ flex: 1, padding: 20 }}>
                <Calendar
                    markedDates={markedDates}
                    onDayPress={day => setSelectedDate(day.dateString)}
                    style={{ backgroundColor: '#F5F5F5' }}
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
                                const moodEntry = moodOptions.find(x => x.value === item.value);
                                return (
                                    <MoodEntryCard
                                        mood={moodEntry?.description || "Unknown Mood"}
                                        emoji={moodEntry?.emoji || "❓"}
                                        description={item.description || null}
                                        color="white"
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
        </SafeAreaView>
    );
}
