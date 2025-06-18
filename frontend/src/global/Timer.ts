export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins >= 10 ? mins : "0" + mins}:${secs >= 10 ? secs : "0" + secs}`;
}