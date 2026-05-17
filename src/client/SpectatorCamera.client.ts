import { Players, RunService, Workspace } from "@rbxts/services";

const player = Players.LocalPlayer;
const camera = Workspace.CurrentCamera!;

const SPECTATOR_HEIGHT = 60;

RunService.RenderStepped.Connect(() => {
  if (player.Team?.Name !== "Spectator") return;

  const character = player.Character;
  const root = character?.FindFirstChild("HumanoidRootPart") as BasePart;
  if (!root) return;

  camera.CameraType = Enum.CameraType.Scriptable;

  const position = root.Position.add(new Vector3(0, SPECTATOR_HEIGHT, 0));
  const lookAt = root.Position;

  camera.CFrame = CFrame.lookAt(position, lookAt);
});