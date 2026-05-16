import { Teams } from "@rbxts/services";

export type GameTeamName = "Blue" | "Red";

export function setTeam(player: Player, teamName: GameTeamName) {
  const team = Teams.FindFirstChild(teamName) as Team;

  if (!team) {
    warn(`Team introuvable : ${teamName}`);
    return;
  }

  player.Neutral = false;
  player.Team = team;
  player.TeamColor = team.TeamColor;
}
