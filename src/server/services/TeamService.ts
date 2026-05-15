import { Teams } from "@rbxts/services";

export function setTeam(player: Player, teamName: "Blue" | "Red") {
  const team = Teams.FindFirstChild(teamName) as Team;
  if (!team) return;

  player.Team = team;
}
