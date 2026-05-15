import {Players, Workspace} from "@rbxts/services";

const SpawnLocationsFolder = Workspace.WaitForChild("SpawnLocations");

const defaultSpawn = SpawnLocationsFolder.WaitForChild(
  "LobbySpawn",
) as SpawnLocation;

Players.PlayerAdded.Connect((player) => {
  player.CharacterAdded.Connect((character) => {
    const playerPosition = character.WaitForChild(
      "HumanoidRootPart",
    ) as BasePart;

    task.wait();

    let spawn: SpawnLocation = defaultSpawn;

    if (player.Team) {
      const spawnName = `${player.Team.Name}Spawn`;

      const teamSpawn = SpawnLocationsFolder.FindFirstChild(
        spawnName,
      ) as SpawnLocation | undefined;

      if (teamSpawn) {
        spawn = teamSpawn;
      }
    }

    playerPosition.CFrame = spawn.CFrame.add(new Vector3(0, 5, 0));
  });
});
