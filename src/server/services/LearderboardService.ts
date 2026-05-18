import {getLeaderboard} from "./routes_api/ApiService_Get";
import {LeaderboardPlayer} from "../../shared/interfaces/Leaderboard";
import {renderLeaderboard} from "../ui/LeaderboardBoardUI";


export function getTopPlayers(page = 1, size = 10): LeaderboardPlayer[] {
  const players = getLeaderboard(page, size);

  if (!players) {
    return [];
  }

  return players;
}

export function startLeaderboardUpdater() {
  task.spawn(() => {
    renderLeaderboard(getTopPlayers(1, 10));

    while (true) {
      task.wait(60);
      renderLeaderboard(getTopPlayers(1, 10));
    }
  });
}
