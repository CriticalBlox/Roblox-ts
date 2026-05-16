import {Players, UserInputService} from "@rbxts/services";

Players.PlayerAdded.Connect((player) => {
  player.Team = undefined

  player.CameraMode = Enum.CameraMode.Classic;

  player.CameraMinZoomDistance = 0.5;
  player.CameraMaxZoomDistance = 0.5;

  player.CharacterAdded.Connect((character) => {
    const humanoid = character.WaitForChild("Humanoid") as Humanoid;
    humanoid.WalkSpeed = 40;
    humanoid.MaxHealth = 200;
    humanoid.Health = 200;
  });
});
