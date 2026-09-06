export function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function uptimeColor(uptime: number | null): string {
  if (uptime === null) return 'text-foreground';
  if (uptime === 100) return 'text-green';
  if (uptime >= 90) return 'text-yellow-400';
  return 'text-low';
}
