export function getMidnightUTC(currentTime: Date): string {
    const midnight = new Date(Date.UTC(
        currentTime.getUTCFullYear(),
        currentTime.getUTCMonth(),
        currentTime.getUTCDate()
    ));
    return midnight.toISOString().split('T')[0];
}