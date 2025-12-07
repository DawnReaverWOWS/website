class SimpleCache {
  cache = /* @__PURE__ */ new Map();
  set(key, data, ttl) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }
  clear() {
    this.cache.clear();
  }
  delete(key) {
    this.cache.delete(key);
  }
}
const cache = new SimpleCache();
const CACHE_DURATION = {
  CLAN_INFO: 30 * 60 * 1e3,
  // 30 minutes
  MEMBER_LIST: 15 * 60 * 1e3,
  // 15 minutes
  PLAYER_STATS: 5 * 60 * 1e3};

const API_BASE_URL = "https://api.worldofwarships.com/wows";
const APP_ID = "007e439533b8d74a7d831b1822603499";
const CLAN_ID = "1000109881";
async function fetchWargaming(endpoint, params = {}) {
  const queryParams = new URLSearchParams({
    application_id: APP_ID,
    ...params
  });
  const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === "error") {
      console.error("Wargaming API Error:", data.error);
      return null;
    }
    return data.data;
  } catch (error) {
    console.error("Failed to fetch from Wargaming API:", error);
    return null;
  }
}
async function getClanInfo() {
  const cacheKey = `clan:${CLAN_ID}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const data = await fetchWargaming(
    "/clans/info/",
    { clan_id: CLAN_ID }
  );
  if (!data || !data[CLAN_ID]) {
    return null;
  }
  const clanInfo = data[CLAN_ID];
  cache.set(cacheKey, clanInfo, CACHE_DURATION.CLAN_INFO);
  return clanInfo;
}
async function getClanMembers() {
  const cacheKey = `clan:${CLAN_ID}:members`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const data = await fetchWargaming(
    "/clans/info/",
    { clan_id: CLAN_ID, extra: "members" }
  );
  if (!data || !data[CLAN_ID] || !data[CLAN_ID].members) {
    return [];
  }
  const membersData = data[CLAN_ID].members;
  const members = Object.values(membersData).map((memberData) => {
    return {
      account_id: memberData.account_id,
      joined_at: memberData.joined_at,
      role: memberData.role
    };
  });
  cache.set(cacheKey, members, CACHE_DURATION.MEMBER_LIST);
  return members;
}
async function getPlayerStats(accountIds) {
  if (accountIds.length === 0) {
    return {};
  }
  const cacheKey = `players:${accountIds.join(",")}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const chunks = chunkArray(accountIds, 100);
  const allStats = {};
  for (const chunk of chunks) {
    const data = await fetchWargaming(
      "/account/info/",
      { account_id: chunk.join(",") }
    );
    if (data) {
      Object.assign(allStats, data);
    }
  }
  cache.set(cacheKey, allStats, CACHE_DURATION.PLAYER_STATS);
  return allStats;
}
function calculatePR(stats) {
  if (stats.battles === 0) {
    return 0;
  }
  const winRate = stats.wins / stats.battles * 100;
  const avgDamage = stats.damage_dealt / stats.battles;
  const avgFrags = stats.frags / stats.battles;
  const pr = avgDamage / 10 + winRate * 10 + avgFrags * 100;
  return Math.round(pr);
}
async function getMembersWithStats() {
  const members = await getClanMembers();
  if (members.length === 0) {
    return [];
  }
  const accountIds = members.map((m) => m.account_id);
  const playerStats = await getPlayerStats(accountIds);
  const membersWithStats = members.map((member) => {
    const stats = playerStats[member.account_id];
    if (!stats || stats.hidden_profile || !stats.statistics?.pvp) {
      return {
        ...member,
        nickname: stats?.nickname || "Unknown",
        battles: 0,
        win_rate: 0,
        avg_damage: 0,
        avg_xp: 0,
        survival_rate: 0,
        pr: 0,
        hidden_profile: true
      };
    }
    const pvp = stats.statistics.pvp;
    const battles = pvp.battles || 1;
    return {
      ...member,
      nickname: stats.nickname,
      battles: pvp.battles,
      win_rate: pvp.wins / battles * 100,
      avg_damage: pvp.damage_dealt / battles,
      avg_xp: pvp.xp / battles,
      survival_rate: pvp.survived_battles / battles * 100,
      pr: calculatePR(pvp),
      last_battle_time: stats.last_battle_time,
      hidden_profile: false
    };
  });
  const roleOrder = {
    "commander": 0,
    "executive_officer": 1,
    "commissioned_officer": 2,
    "recruitment_officer": 3,
    "officer": 4,
    "private": 5
  };
  return membersWithStats.sort((a, b) => {
    const roleA = roleOrder[a.role] ?? 999;
    const roleB = roleOrder[b.role] ?? 999;
    if (roleA !== roleB) {
      return roleA - roleB;
    }
    return b.pr - a.pr;
  });
}
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export { getMembersWithStats as a, getClanInfo as b, getClanMembers as g };
