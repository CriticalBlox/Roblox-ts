import {apiPatch} from "../routes_api/ApiService_Patch";


export function updateApiGame(
  gameId: number,
  blueScore: number,
  redScore: number,
  winnerTeam?: "blue" | "red",
) {
  return apiPatch(`/games/${gameId}`, {
    blue_score: blueScore,
    red_score: redScore,
    winner_team: winnerTeam,
    ended_at: DateTime.now().ToIsoDate(),
  });
}

export function updateApiRound(
  roundId: number,
  winnerTeam?: "blue" | "red",
) {
  return apiPatch(`/rounds/${roundId}`, {
    winner_team: winnerTeam,
    ended_at: DateTime.now().ToIsoDate(),
  });
}

export function updateApiGamePlayer(
  gamePlayerId: number,
  kills: number,
  deaths: number,
) {
  return apiPatch(`/game-players/${gamePlayerId}`, {
    kills,
    deaths,
  });
}