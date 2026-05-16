import { Players, Workspace } from "@rbxts/services";

const startZone = Workspace.WaitForChild("StartZone") as BasePart;

export function getStartPlayers() {
  const startPlayers = new Array<Player>();

  const parts = Workspace.GetPartsInPart(startZone);

  for (const part of parts) {
    const character = part.Parent;
    if (!character) continue;

    const player = Players.GetPlayerFromCharacter(character);
    if (!player) continue;

    if (!startPlayers.includes(player)) {
      startPlayers.push(player);
    }
  }

  return startPlayers;
}

export function getStartCount() {
  return getStartPlayers().size();
}
