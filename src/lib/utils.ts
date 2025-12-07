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

/**
 * Get military rank insignia based on role
 */
export function getRankInsignia(role: string): string {
  const insigniaMap: Record<string, string> = {
    commander: '★★★★★',             // 5 stars - Fleet Admiral
    executive_officer: '★★★★',      // 4 stars - Admiral
    recruitment_officer: '★★★',     // 3 stars - Vice Admiral
    commissioned_officer: '★★',     // 2 stars - Rear Admiral
    officer: '★',                   // 1 star - Commodore
    private: '═',                   // Bar - Officer Candidate
  };
  return insigniaMap[role] || '─';
}

/**
 * Achievement pin types and their criteria
 */
export interface AchievementPin {
  icon: string;
  name: string;
  description: string;
  color: string;
}

export const ACHIEVEMENT_PINS: Record<string, AchievementPin> = {
  founder: {
    icon: '⚓',
    name: 'Founder',
    description: 'Original founding member of the clan',
    color: '#FFD700',
  },
  veteran: {
    icon: '▓',
    name: 'Veteran',
    description: 'Member for 6+ months',
    color: '#C0C0C0',
  },
  battle_hardened: {
    icon: '▄',
    name: 'Battle Hardened',
    description: '10,000+ total battles',
    color: '#8B4513',
  },
  elite_warrior: {
    icon: '◆',
    name: 'Elite Warrior',
    description: '2450+ PR (Super Unicum)',
    color: '#9B59B6',
  },
  sharpshooter: {
    icon: '◇',
    name: 'Sharpshooter',
    description: '60%+ Win Rate',
    color: '#D4AF37',
  },
  top_performer: {
    icon: '■',
    name: 'Top Performer',
    description: 'Top 5 in clan by PR',
    color: '#FF6B35',
  },
  active_duty: {
    icon: '●',
    name: 'Active Duty',
    description: 'Played within last 7 days',
    color: '#00D9FF',
  },
  clan_battle_veteran: {
    icon: '▀',
    name: 'CB Veteran',
    description: 'Participated in 3+ CB seasons',
    color: '#318000',
  },
  damage_dealer: {
    icon: '►',
    name: 'Damage Dealer',
    description: '80,000+ average damage',
    color: '#FE0E00',
  },
  consistent: {
    icon: '▬',
    name: 'Consistent',
    description: '1000+ recent battles',
    color: '#02C9B3',
  },
};

/**
 * Calculate which achievement pins a member has earned
 */
export function calculateAchievements(member: {
  battles: number;
  pr: number;
  win_rate: number;
  avg_damage: number;
  last_battle_time: number | null;
  joined_at?: number | null;
  account_id: number;
}): string[] {
  const achievements: string[] = [];
  const now = Date.now() / 1000; // Convert to seconds

  // Founder (hardcoded account IDs - you'll need to set these)
  const founderIds = [1234567890]; // Replace with actual founder account IDs
  if (founderIds.includes(member.account_id)) {
    achievements.push('founder');
  }

  // Veteran - member for 6+ months (requires joined_at timestamp)
  if (member.joined_at && (now - member.joined_at) > (180 * 24 * 60 * 60)) {
    achievements.push('veteran');
  }

  // Battle Hardened - 10,000+ battles
  if (member.battles >= 10000) {
    achievements.push('battle_hardened');
  }

  // Elite Warrior - 2450+ PR (Super Unicum)
  if (member.pr >= 2450) {
    achievements.push('elite_warrior');
  }

  // Sharpshooter - 60%+ Win Rate
  if (member.win_rate >= 60) {
    achievements.push('sharpshooter');
  }

  // Active Duty - played within last 7 days
  if (member.last_battle_time && (now - member.last_battle_time) < (7 * 24 * 60 * 60)) {
    achievements.push('active_duty');
  }

  // Damage Dealer - 80,000+ average damage
  if (member.avg_damage >= 80000) {
    achievements.push('damage_dealer');
  }

  // Consistent - 1000+ battles (could be made more sophisticated)
  if (member.battles >= 1000) {
    achievements.push('consistent');
  }

  return achievements;
}

/**
 * Calculate top performers by PR
 */
export function calculateTopPerformers(members: any[], topN: number = 5): number[] {
  return members
    .filter(m => !m.hidden_profile && m.pr > 0)
    .sort((a, b) => b.pr - a.pr)
    .slice(0, topN)
    .map(m => m.account_id);
}
