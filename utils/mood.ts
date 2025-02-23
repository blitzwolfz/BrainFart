export const moodOptions : Mood[] = [
    { color: '#FF0000', emoji: '😡', description: 'Very Angry', value: -3 },
    { color: '#FF4500', emoji: '😠', description: 'Angry', value: -2 },
    { color: '#FF8C00', emoji: '😟', description: 'Worried', value: -1 },
    { color: '#FFA500', emoji: '😐', description: 'Neutral', value: 0 },
    { color: '#FFD700', emoji: '🙂', description: 'Slightly Happy', value: 1 },
    { color: '#ADFF2F', emoji: '😊', description: 'Happy', value: 2 },
    { color: '#32CD32', emoji: '😀', description: 'Very Happy', value: 3 },
    { color: '#008000', emoji: '😃', description: 'Excited', value: 4 },
    { color: '#006400', emoji: '😁', description: 'Elated', value: 5 },
];

export interface Mood {
    color: string;
    emoji: string;
    description: string;
    value: number;
}