import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as SQLite from 'expo-sqlite';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MoodEntryCard from '@/components/ui/Card';
import Button from '@/components/ui/Button';



export default function MoodCalendarScreen() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [entries, setEntries] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const db = SQLite.openDatabaseSync('moods.db');
    useEffect(() => {
        // initializeDatabase();
        loadMarkedDates();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            loadEntries(selectedDate);
        }
    }, [selectedDate]);

    // const initializeDatabase = () => {
    //     db.execSync(
    //         `CREATE TABLE IF NOT EXISTS moods (
    //             id INTEGER PRIMARY KEY,
    //             mood TEXT,
    //             emoji TEXT,
    //             description TEXT,
    //             color TEXT
    //         );`
    //     );
    // };

    const loadMarkedDates = () => {
        const result = db.getAllSync('SELECT * FROM moods;');
        console.log("A");
        console.log("Database Check:", result);
        console.log("A");
        let marks = {};
        result.forEach(row => {
            console.log(row);
            const formattedDate = new Date(row.id).toISOString().split('T')[0];
            marks[formattedDate] = { marked: true, dotColor: 'red' };
        });
        setMarkedDates(marks);
    };

    const loadEntries = date => {
        const startTimestamp = Math.floor(new Date(date).setHours(0, 0, 0, 0) / 1000);
        const endTimestamp = Math.floor(new Date(date).setHours(23, 59, 59, 999) / 1000);
        const result = db.getAllSync(`SELECT * FROM moods;`);
        console.log(result);
        setEntries(result);
    };

    const deleteEntry = id => {
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
            <ThemedText type="title" style={{ marginTop: 16 }}>Entries for {selectedDate}</ThemedText>
            <FlatList
                data={entries}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <MoodEntryCard mood={undefined} emoji={undefined} description={undefined} color="white" onDelete={undefined}>
                        <ThemedText>{item.emoji} {item.description}</ThemedText>
                        <Button onPress={() => deleteEntry(item.id)}>Delete</Button>
                    </MoodEntryCard>
                )}
            />
        </ThemedView>
    );
}