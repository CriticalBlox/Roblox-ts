import { Workspace } from "@rbxts/services";

const folder = Workspace.WaitForChild("SpawnLocations");

export function teleport(player: Player) {
  const char = player.Character;
  if (!char) return;

  const playerLocation = char.FindFirstChild("HumanoidRootPart") as BasePart;
  if (!playerLocation) return;

  const spawn =
    player.Team
      ? (folder.FindFirstChild(`${player.Team.Name}Spawn`) as SpawnLocation)
      : (folder.WaitForChild("LobbySpawn") as SpawnLocation);

  playerLocation.CFrame = spawn.CFrame.add(new Vector3(0, 5, 0));
}
