import { Teams } from "@rbxts/services";
import {teleport} from "./SpawnService";

export function setSpectator(player: Player) {
  const spectator = Teams.FindFirstChild("Spectator") as Team;

  if (!spectator) return;

  player.Team = spectator;
  player.Neutral = false;
  teleport(player)
}
