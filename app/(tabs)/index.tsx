import React, { useState, useEffect } from 'react';
import { ScrollView, Dimensions, View, StyleSheet } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Card, Text, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SQLite from 'expo-sqlite';
import * as Localization from 'expo-localization';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

// Open database connection
const db = SQLite.openDatabaseSync('moods');

/**
 * Convert a UNIX timestamp (in seconds) to a local date string (YYYY-MM-DD)
 * based on the user's timezone.
 */
const convertToLocalDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(Localization.locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).split('/').reverse().join('-'); // Adjust for YYYY-MM-DD format
};

/**
 * Convert a date string (YYYY-MM-DD) to a UNIX timestamp for local time calculations.
 */
const convertToTimestamp = (date, type) => {
    const localDate = new Date(`${date}T00:00:00`);
    if (type === "end") {
        localDate.setHours(23, 59, 59, 999);
    }
    return Math.floor(localDate.getTime() / 1000);
};

export default function StatisticsScreen() {
    const [moodData, setMoodData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);
    const [averageMood, setAverageMood] = useState(null);
    const [highestMood, setHighestMood] = useState(null);
    const [lowestMood, setLowestMood] = useState(null);

    useEffect(() => {
        fetchMoodData();
    }, []);

    const fetchMoodData = () => {
        const today = new Date();
        const startTimestamp = convertToTimestamp(new Date(today.setDate(today.getDate() - 14)).toISOString().split('T')[0], "start");
        const endTimestamp = convertToTimestamp(new Date().toISOString().split('T')[0], "end");

        const results = db.getAllSync(`SELECT * FROM moods WHERE id BETWEEN ${startTimestamp} AND ${endTimestamp} ORDER BY id ASC;`);
        console.log("Results", results);
        setMoodData(results);
        processMoodData(results);
    };

    const processMoodData = (entries) => {
        if (entries.length === 0) {
            setLabels([]);
            setData([]);
            setAverageMood(null);
            setHighestMood(null);
            setLowestMood(null);
            return;
        }

        // Group moods by date and calculate the average if there are multiple entries for the same date
        const groupedData = {};
        entries.forEach(entry => {
            const date = convertToLocalDate(entry.id); // Convert timestamp to local date
            if (!groupedData[date]) {
                groupedData[date] = { total: 0, count: 0 };
            }
            groupedData[date].total += entry.value;
            groupedData[date].count += 1;
        });

        const processedEntries = Object.keys(groupedData).map(date => ({
            date,
            mood: groupedData[date].total / groupedData[date].count // Average mood for that date
        }));

        // Sort dates chronologically
        processedEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

        const labels = processedEntries.map(entry => entry.date);
        const data = processedEntries.map(entry => entry.mood);

        setLabels(labels);
        setData(data);

        setAverageMood((data.reduce((a, b) => a + b, 0) / data.length).toFixed(1));
        setHighestMood(Math.max(...data));
        setLowestMood(Math.min(...data));
    };

    return (
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <ThemedView>
                    <ThemedText type="title">Mood Statistics</ThemedText>
                </ThemedView>

                {data.length > 0 ? (
                    <>
                        {/* Mood Trend Chart */}
                        <Card style={styles.card}>
                            <Text variant="titleMedium" style={styles.cardTitle}>Mood Trends (Last 2 Weeks)</Text>
                            <Divider style={styles.divider} />
                            <View style={styles.chartContainer}>
                                <LineChart
                                    data={{ labels, datasets: [{ data }] }}
                                    width={Dimensions.get('window').width - 48}
                                    height={220}
                                    yAxisLabel=""
                                    yAxisSuffix=""
                                    chartConfig={{
                                        backgroundGradientFrom: "#ffffff",
                                        backgroundGradientTo: "#ffffff",
                                        decimalPlaces: 1,
                                        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    }}
                                    bezier
                                    style={styles.chart}
                                />
                            </View>
                        </Card>

                        {/* Summary Stats */}
                        <Card style={styles.card}>
                            <Text variant="titleMedium" style={styles.cardTitle}>Mood Summary</Text>
                            <Divider style={styles.divider} />
                            <Text>📊 Average Mood: {averageMood}</Text>
                            <Text>📈 Highest Mood: {highestMood}</Text>
                            <Text>📉 Lowest Mood: {lowestMood}</Text>
                        </Card>

                        {/* Mood Distribution (Bar Chart) */}
                        <Card style={styles.card}>
                            <Text variant="titleMedium" style={styles.cardTitle}>Mood Distribution</Text>
                            <Divider style={styles.divider} />
                            <View style={styles.chartContainer}>
                                <BarChart
                                    data={{
                                        labels: ["Low", "Neutral", "Good"],
                                        datasets: [{ data: [
                                                data.filter(m => m < -1).length,
                                                data.filter(m => m >= -1 && m <= 1).length,
                                                data.filter(m => m >= 2).length
                                            ] }]
                                    }}
                                    width={Dimensions.get('window').width - 48}
                                    height={220}
                                    yAxisLabel=""
                                    yAxisSuffix=""
                                    chartConfig={{
                                        backgroundGradientFrom: "#ffffff",
                                        backgroundGradientTo: "#ffffff",
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    }}
                                    style={styles.chart}
                                />
                            </View>
                        </Card>
                    </>
                ) : (
                    <View style={styles.emptyView}>
                        <Text>No mood data available for the last two weeks.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        marginVertical: 10,
        padding: 16,
        borderRadius: 10,
        overflow: "hidden", // Prevents content overflow
    },
    chartContainer: {
        alignItems: 'center', // Centers the chart inside the card
        overflow: "hidden",
    },
    cardTitle: {
        marginBottom: 8,
        fontWeight: 'bold',
    },
    divider: {
        marginVertical: 8,
    },
    chart: {
        marginTop: 10,
        borderRadius: 10,
        alignSelf: 'center',
    },
    emptyView: {
        alignItems: "center",
        marginTop: 20,
    },
});
