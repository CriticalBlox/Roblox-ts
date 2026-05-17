import { Players, RunService, Workspace } from "@rbxts/services";

const player = Players.LocalPlayer;

const Sectator_Height = 60;

function resetCamera() {
  const camera = Workspace.CurrentCamera;
  if (!camera) return;

  camera.CameraType = Enum.CameraType.Custom;
  camera.CameraSubject = player.Character?.FindFirstChild("Humanoid") as Humanoid;
}

player.GetPropertyChangedSignal("Team").Connect(() => {
  if (player.Team?.Name !== "Spectator") {
    resetCamera();
  }
});

player.CharacterAdded.Connect(() => {
  task.wait(0.2);

  if (player.Team?.Name !== "Spectator") {
    resetCamera();
  }
});

RunService.RenderStepped.Connect(() => {
  const camera = Workspace.CurrentCamera;
  if (!camera) return;

  if (player.Team?.Name !== "Spectator") {
    if (camera.CameraType === Enum.CameraType.Scriptable) {
      resetCamera();
    }

    return;
  }

  const character = player.Character;
  const root = character?.FindFirstChild("HumanoidRootPart") as BasePart;
  if (!root) return;

  camera.CameraType = Enum.CameraType.Scriptable;

  const position = root.Position.add(new Vector3(0, Sectator_Height, 0));
  camera.CFrame = CFrame.lookAt(position, root.Position);
});
