// Utility functions for formatting and calculations

/**
 * Format number with commas (e.g., 1000 -> 1,000)
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format percentage to 2 decimal places
 */
export function formatPercentage(num: number): string {
  return `${num.toFixed(2)}%`;
}

/**
 * Format date from Unix timestamp
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp * 1000;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Get PR rating label and color
 */
export function getPRRating(pr: number): { label: string; color: string } {
  if (pr >= 2450) return { label: 'Super Unicum', color: '#9B59B6' };
  if (pr >= 2100) return { label: 'Unicum', color: '#D4AF37' };
  if (pr >= 1750) return { label: 'Great', color: '#00D4FF' };
  if (pr >= 1550) return { label: 'Very Good', color: '#02C9B3' };
  if (pr >= 1350) return { label: 'Good', color: '#318000' };
  if (pr >= 1100) return { label: 'Above Average', color: '#44B300' };
  if (pr >= 750) return { label: 'Average', color: '#FFC71F' };
  if (pr >= 600) return { label: 'Below Average', color: '#FE7903' };
  if (pr >= 300) return { label: 'Bad', color: '#FE0E00' };
  return { label: 'Very Bad', color: '#930D0D' };
}

/**
 * Get Win Rate rating and color
 */
export function getWinRateRating(wr: number): { label: string; color: string } {
  if (wr >= 60) return { label: 'Excellent', color: '#9B59B6' };
  if (wr >= 56) return { label: 'Great', color: '#D4AF37' };
  if (wr >= 54) return { label: 'Very Good', color: '#02C9B3' };
  if (wr >= 52) return { label: 'Good', color: '#318000' };
  if (wr >= 49) return { label: 'Average', color: '#FFC71F' };
  if (wr >= 47) return { label: 'Below Average', color: '#FE7903' };
  return { label: 'Bad', color: '#FE0E00' };
}

/**
 * Get clan role display name
 */
export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    commander: 'Commander',
    executive_officer: 'Executive Officer',
    recruitment_officer: 'Recruiting Officer',
    commissioned_officer: 'Commissioned Officer',
    officer: 'Line Officer',
    private: 'Enlisted',
  };
  return roleMap[role] || role;
}

/**
 * Get clan role color
 */
export function getRoleColor(role: string): string {
  const colorMap: Record<string, string> = {
    commander: '#FFD700',           // Gold
    executive_officer: '#FFA500',   // Orange
    recruitment_officer: '#9B59B6',  // Purple
    commissioned_officer: '#00D9FF', // Cyan
    officer: '#0055AA',              // Blue
    private: '#8B9CB6',              // Steel gray
  };
  return colorMap[role] || '#8B9CB6';
}
