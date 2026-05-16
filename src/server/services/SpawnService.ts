import { Players, Workspace } from "@rbxts/services";

const folder = Workspace.WaitForChild("SpawnLocations");

function getSpawn(player: Player) {
  if (player.Team) {
    const teamSpawn = folder.FindFirstChild(
      `${player.Team.Name}Spawn`,
    ) as SpawnLocation;

    if (teamSpawn) {
      return teamSpawn;
    }
  }

  return folder.WaitForChild("LobbySpawn") as SpawnLocation;
}

export function teleport(player: Player) {
  const character = player.Character;
  if (!character) return;

  const root = character.WaitForChild(
    "HumanoidRootPart",
  ) as BasePart;

  const spawn = getSpawn(player);

  root.CFrame = spawn.CFrame.add(new Vector3(0, 5, 0));
}

export function setupSpawns() {
  Players.PlayerAdded.Connect((player) => {
    player.CharacterAdded.Connect(() => {
      teleport(player);
    });
  });
}
