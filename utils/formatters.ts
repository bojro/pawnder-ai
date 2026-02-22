export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function formatDaysRemaining(endDate: string): string {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const days = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
  if (days === 0) return 'Complete';
  if (days === 1) return '1 day remaining';
  return `${days} days remaining`;
}

export function getStabilityColor(score: number): string {
  if (score >= 70) return '#4CAF7A';
  if (score >= 40) return '#E6B566';
  return '#D32F2F';
}

export function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
