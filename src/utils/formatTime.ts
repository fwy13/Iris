export function formatTime(seconds: number) {
    const hour = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const second = seconds % 60;
    return `${hour}:${minutes}:${second}`;
}
