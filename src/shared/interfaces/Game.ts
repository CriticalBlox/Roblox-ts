export interface CreateGameResponse {
  id: number;
  map_name: string;
  rounds_total: number;
  red_score: number;
  blue_score: number;
  winner_team?: string;
}

export interface GameResponse {
  id: number;
  map_name: string;
  rounds_total: number;
  red_score: number;
  blue_score: number;
  winner_team?: "red" | "blue";
}

export interface RoundResponse {
  id: number;
  game_id: number;
  round_number: number;
  winner_team?: "red" | "blue";
}

export interface GamePlayerResponse {
  id: number;
  user_id?: number;
  game_id: number;
  roblox_id?: number;
  pseudo: string;
  team: "red" | "blue";
  kills: number;
  deaths: number;
}