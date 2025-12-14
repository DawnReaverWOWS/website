import type { APIRoute } from 'astro';
import { getClanInfo, getClanMembers } from '../../../lib/wargaming-api';

export const prerender = false;

const API_BASE_URL = 'https://api.worldofwarships.com/wows';
const APP_ID = import.meta.env.WARGAMING_APP_ID || '007e439533b8d74a7d831b1822603499';

interface PlayerSearchResult {
  account_id: number;
  nickname: string;
}

interface PlayerStats {
  account_id: number;
  nickname: string;
  statistics?: {
    pvp?: {
      battles: number;
      wins: number;
      damage_dealt: number;
      frags: number;
      xp: number;
      survived_battles: number;
    };
  };
  hidden_profile?: boolean;
  last_battle_time?: number;
}

/**
 * GET /api/players/search?name=PlayerName
 * Search for a player by name and return their stats + clan capacity
 */
export const GET: APIRoute = async ({ url }) => {
  try {
    const playerName = url.searchParams.get('name');

    if (!playerName || playerName.length < 3) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Player name must be at least 3 characters',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Step 1: Search for player by name
    const searchUrl = `${API_BASE_URL}/account/list/?application_id=${APP_ID}&search=${encodeURIComponent(playerName)}&type=exact`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status === 'error' || !searchData.data || searchData.data.length === 0) {
      // Try startswith search if exact match fails
      const startsWithUrl = `${API_BASE_URL}/account/list/?application_id=${APP_ID}&search=${encodeURIComponent(playerName)}&type=startswith&limit=5`;
      const startsWithResponse = await fetch(startsWithUrl);
      const startsWithData = await startsWithResponse.json();

      if (startsWithData.status === 'error' || !startsWithData.data || startsWithData.data.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Player not found',
          suggestions: [],
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Return suggestions for partial matches
      return new Response(JSON.stringify({
        success: false,
        error: 'Exact match not found',
        suggestions: startsWithData.data.map((p: PlayerSearchResult) => p.nickname),
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const player: PlayerSearchResult = searchData.data[0];

    // Step 2: Get player stats
    const statsUrl = `${API_BASE_URL}/account/info/?application_id=${APP_ID}&account_id=${player.account_id}`;
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();

    const playerStats: PlayerStats | null = statsData.data?.[player.account_id];

    // Step 3: Get clan info (member count)
    const clanInfo = await getClanInfo();
    const clanMembers = await getClanMembers();

    // Step 4: Check if player is already in clan
    const isInClan = clanMembers.some(m => m.account_id === player.account_id);

    // Calculate stats
    let stats = null;
    if (playerStats && !playerStats.hidden_profile && playerStats.statistics?.pvp) {
      const pvp = playerStats.statistics.pvp;
      const battles = pvp.battles || 1;

      stats = {
        battles: pvp.battles,
        winRate: ((pvp.wins / battles) * 100).toFixed(2),
        avgDamage: Math.round(pvp.damage_dealt / battles),
        avgFrags: (pvp.frags / battles).toFixed(2),
        survivalRate: ((pvp.survived_battles / battles) * 100).toFixed(2),
        // Simplified PR calculation
        pr: Math.round((pvp.damage_dealt / battles / 10) + ((pvp.wins / battles) * 1000) + (pvp.frags / battles * 100)),
      };
    }

    // Check requirements
    const meetsRequirements = stats ? {
      winRate: parseFloat(stats.winRate) >= 45,
      battles: stats.battles >= 500,
      pr: stats.pr >= 800, // Lowered from 2800 for testing
    } : null;

    return new Response(JSON.stringify({
      success: true,
      player: {
        accountId: player.account_id,
        nickname: player.nickname,
        stats,
        hiddenProfile: playerStats?.hidden_profile || false,
        lastBattle: playerStats?.last_battle_time,
      },
      clan: {
        name: clanInfo?.name || 'DawnReaver',
        tag: clanInfo?.tag || 'DAWN',
        memberCount: clanMembers.length,
        maxMembers: 50,
        hasSpace: clanMembers.length < 50,
      },
      isAlreadyInClan: isInClan,
      meetsRequirements,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error searching player:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to search player',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
