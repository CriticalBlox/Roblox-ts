import {apiPost} from "../routes_api/ApiService_Post";
import {apiPatch} from "../routes_api/ApiService_Patch";


export const playerStatsIds = new Map<Player, number>();

type StatsResponse = {
  id: number;
};

export function createStatsIfFirstJoin(player: Player) {
  task.spawn(() => {
    const stats = apiPost<StatsResponse>("/stats", {
      roblox_id: player.UserId,
      pseudo: player.Name,
      kills: 0,
      deaths: 0,
      match_played: 0,
      win_total: 0,
      lose_total: 0,
    });

    if (stats) {
      playerStatsIds.set(player, stats.id);
    }
  });
}

export function updateApiPlayerStats(
  player: Player,
  kills: number,
  deaths: number,
  hasWin: boolean,
) {
  return apiPatch(`/stats/${player.UserId}`, {
    kills,
    deaths,
    match_played: 1,
    win_total: hasWin ? 1 : 0,
    lose_total: hasWin ? 0 : 1,
  });
}
