
import {GamePlayerResponse, GameResponse, RoundResponse} from "../../../shared/interfaces/Game";
import {apiPost} from "../routes_api/ApiService_Post";


export function createApiGame(roundsTotal: number) {
  return apiPost<GameResponse>("/games", {
    map_name: "Map-1",
    rounds_total: roundsTotal,
    red_score: 0,
    blue_score: 0,
    winner_team: undefined,
  });
}

export function createApiRound(
  gameId: number,
  roundNumber: number,
  winnerTeam?: "red" | "blue",
) {
  return apiPost<RoundResponse>("/rounds", {
    game_id: gameId,
    round_number: roundNumber,
    winner_team: winnerTeam,
  });
}

export function createApiGamePlayer(
  gameId: number,
  player: Player,
  team: "Blue" | "Red",
) {
  return apiPost<GamePlayerResponse>("/game-players", {
    user_id: undefined,
    game_id: gameId,
    roblox_id: player.UserId,
    pseudo: player.Name,
    team: team === "Blue" ? "blue" : "red",
    kills: 0,
    deaths: 0,
  });
}
