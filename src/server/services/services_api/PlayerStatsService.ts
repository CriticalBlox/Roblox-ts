import {apiPost} from "../routes_api/ApiService_Post";

export function createStatsIfFirstJoin(player: Player) {
  task.spawn(() => {
    const result = apiPost("/stats", {
      pseudo: player.Name,
      roblox_id: player.UserId,
      kills: 0,
      deaths: 0,
      match_played: 0,
      win_total: 0,
      lose_total: 0,
    })

    if (result) {
     return result;
    }
  })
}
