// Wargaming API Client for World of Warships

import type {
  ClanInfo,
  ClanMember,
  PlayerStats,
  WargamingAPIResponse,
  MemberWithStats,
} from './types';
import { cache, CACHE_DURATION } from './cache';

const API_BASE_URL = 'https://api.worldofwarships.com/wows';
const APP_ID = import.meta.env.WARGAMING_APP_ID || '007e439533b8d74a7d831b1822603499';
const CLAN_ID = import.meta.env.CLAN_ID || '1000109881'; // Replace with your actual clan ID

/**
 * Fetch data from Wargaming API with caching
 */
async function fetchWargaming<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T | null> {
  const queryParams = new URLSearchParams({
    application_id: APP_ID,
    ...params,
  });

  const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    const data: WargamingAPIResponse<T> = await response.json();

    if (data.status === 'error') {
      console.error('Wargaming API Error:', data.error);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('Failed to fetch from Wargaming API:', error);
    return null;
  }
}

/**
 * Get clan information
 */
export async function getClanInfo(): Promise<ClanInfo | null> {
  const cacheKey = `clan:${CLAN_ID}`;
  const cached = cache.get<ClanInfo>(cacheKey);

  if (cached) {
    return cached;
  }

  const data = await fetchWargaming<Record<string, ClanInfo>>(
    '/clans/info/',
    { clan_id: CLAN_ID }
  );

  if (!data || !data[CLAN_ID]) {
    return null;
  }

  const clanInfo = data[CLAN_ID];
  cache.set(cacheKey, clanInfo, CACHE_DURATION.CLAN_INFO);

  return clanInfo;
}

/**
 * Get clan members list
 */
export async function getClanMembers(): Promise<ClanMember[]> {
  const cacheKey = `clan:${CLAN_ID}:members`;
  const cached = cache.get<ClanMember[]>(cacheKey);

  if (cached) {
    return cached;
  }

  // Fetch clan info which includes members
  const data = await fetchWargaming<Record<string, any>>(
    '/clans/info/',
    { clan_id: CLAN_ID, extra: 'members' }
  );

  if (!data || !data[CLAN_ID] || !data[CLAN_ID].members_ids) {
    return [];
  }

  // Convert members_ids to ClanMember format
  const accountIds = Object.keys(data[CLAN_ID].members_ids);
  const members: ClanMember[] = accountIds.map((accountId) => {
    const memberData = data[CLAN_ID].members_ids[accountId];
    return {
      account_id: parseInt(accountId),
      joined_at: memberData.joined_at,
      role: memberData.role,
    };
  });

  cache.set(cacheKey, members, CACHE_DURATION.MEMBER_LIST);

  return members;
}

/**
 * Get player statistics for multiple accounts
 */
export async function getPlayerStats(accountIds: number[]): Promise<Record<number, PlayerStats>> {
  if (accountIds.length === 0) {
    return {};
  }

  const cacheKey = `players:${accountIds.join(',')}`;
  const cached = cache.get<Record<number, PlayerStats>>(cacheKey);

  if (cached) {
    return cached;
  }

  // Wargaming API accepts max 100 account IDs at once
  const chunks = chunkArray(accountIds, 100);
  const allStats: Record<number, PlayerStats> = {};

  for (const chunk of chunks) {
    const data = await fetchWargaming<Record<number, PlayerStats>>(
      '/account/info/',
      { account_id: chunk.join(',') }
    );

    if (data) {
      Object.assign(allStats, data);
    }
  }

  cache.set(cacheKey, allStats, CACHE_DURATION.PLAYER_STATS);

  return allStats;
}

/**
 * Calculate Personal Rating (PR)
 * Simplified formula based on damage and win rate
 */
function calculatePR(stats: PlayerStats['statistics']['pvp']): number {
  if (stats.battles === 0) {
    return 0;
  }

  const winRate = (stats.wins / stats.battles) * 100;
  const avgDamage = stats.damage_dealt / stats.battles;
  const avgFrags = stats.frags / stats.battles;

  // Simplified PR formula (actual PR is more complex)
  const pr = (avgDamage / 10) + (winRate * 10) + (avgFrags * 100);

  return Math.round(pr);
}

/**
 * Get members with full statistics
 */
export async function getMembersWithStats(): Promise<MemberWithStats[]> {
  const members = await getClanMembers();

  if (members.length === 0) {
    return [];
  }

  const accountIds = members.map((m) => m.account_id);
  const playerStats = await getPlayerStats(accountIds);

  const membersWithStats: MemberWithStats[] = members.map((member) => {
    const stats = playerStats[member.account_id];

    if (!stats || stats.hidden_profile || !stats.statistics?.pvp) {
      return {
        ...member,
        nickname: stats?.nickname || 'Unknown',
        battles: 0,
        win_rate: 0,
        avg_damage: 0,
        avg_xp: 0,
        survival_rate: 0,
        pr: 0,
        hidden_profile: true,
      };
    }

    const pvp = stats.statistics.pvp;
    const battles = pvp.battles || 1; // Avoid division by zero

    return {
      ...member,
      nickname: stats.nickname,
      battles: pvp.battles,
      win_rate: (pvp.wins / battles) * 100,
      avg_damage: pvp.damage_dealt / battles,
      avg_xp: pvp.xp / battles,
      survival_rate: (pvp.survived_battles / battles) * 100,
      pr: calculatePR(pvp),
      last_battle_time: stats.last_battle_time,
      hidden_profile: false,
    };
  });

  // Sort by PR (descending)
  return membersWithStats.sort((a, b) => b.pr - a.pr);
}

/**
 * Utility: Chunk array into smaller arrays
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
