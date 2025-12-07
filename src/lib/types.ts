// TypeScript types for Wargaming API

export interface ClanInfo {
  clan_id: number;
  tag: string;
  name: string;
  members_count: number;
  created_at: number;
  description?: string;
  emblems: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface ClanMember {
  account_id: number;
  joined_at: number;
  role: 'commander' | 'executive_officer' | 'officer' | 'private';
  account_name?: string;
}

export interface PlayerStats {
  account_id: number;
  nickname: string;
  statistics: {
    pvp: {
      battles: number;
      wins: number;
      losses: number;
      survived_battles: number;
      damage_dealt: number;
      frags: number;
      xp: number;
    };
  };
  hidden_profile: boolean;
  last_battle_time?: number;
}

export interface ShipStats {
  ship_id: number;
  battles: number;
  wins: number;
  damage_dealt: number;
  frags: number;
  survived_battles: number;
}

export interface MemberWithStats extends ClanMember {
  nickname: string;
  battles: number;
  win_rate: number;
  avg_damage: number;
  avg_xp: number;
  survival_rate: number;
  pr: number; // Personal Rating (calculated)
  last_battle_time?: number;
  hidden_profile: boolean;
}

export interface WargamingAPIResponse<T> {
  status: 'ok' | 'error';
  meta: {
    count: number;
  };
  data: T;
  error?: {
    message: string;
    code: number;
  };
}
