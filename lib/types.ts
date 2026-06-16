// Shapes returned by the worldcup26.ir REST API. The API serialises most
// numeric values as strings, so we keep them as strings here and coerce where
// needed in lib/utils.ts (`num`) and the other lib modules.

export interface Team {
  _id: string;
  id: string;
  name_en: string;
  name_fa: string;
  flag: string;
  fifa_code: string;
  iso2: string;
  groups: string; // group letter A–L
}

export type MatchType = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final';

export interface Game {
  _id: string;
  id: string;
  home_team_id: string; // "0" when undecided (knockout)
  away_team_id: string;
  home_score: string;
  away_score: string;
  home_scorers: string; // postgres-array string or "null"
  away_scorers: string;
  group: string; // "A".."L" or "R32" / "R16" / "QF" / "SF" / "3RD" / "FINAL"
  matchday: string;
  local_date: string; // "MM/DD/YYYY HH:mm"
  persian_date: string;
  stadium_id: string;
  finished: 'TRUE' | 'FALSE';
  time_elapsed: string; // "notstarted" | "finished" | live minute
  type: MatchType;
  home_team_name_en?: string;
  home_team_name_fa?: string;
  away_team_name_en?: string;
  away_team_name_fa?: string;
  home_team_label?: string; // e.g. "Winner Match 86" when undecided
  away_team_label?: string;
}

export interface GroupRow {
  team_id: string;
  mp: string;
  w: string;
  l: string;
  d: string;
  pts: string;
  gf: string;
  ga: string;
  gd: string;
}

export interface Group {
  _id: string;
  name: string; // "A".."L"
  teams: GroupRow[];
}

export interface Stadium {
  _id: string;
  id: string;
  name_en: string;
  name_fa: string;
  fifa_name: string;
  city_en: string;
  city_fa?: string;
  country_en: string;
  country_fa?: string;
  capacity: number;
  region?: string;
}
