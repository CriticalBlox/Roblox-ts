import { Players, RunService, Workspace } from "@rbxts/services";

const player = Players.LocalPlayer;
const startZone = Workspace.WaitForChild("StartZone") as Model;

const startZoneDisplayPart = new Instance("Part");
startZoneDisplayPart.Name = "StartZoneDisplayPart";
startZoneDisplayPart.Anchored = true;
startZoneDisplayPart.CanCollide = false;
startZoneDisplayPart.CanQuery = false;
startZoneDisplayPart.CanTouch = false;
startZoneDisplayPart.Transparency = 1;
startZoneDisplayPart.Size = new Vector3(1, 1, 1);
startZoneDisplayPart.CFrame = startZone.GetPivot();
startZoneDisplayPart.Parent = Workspace;

let gui: BillboardGui;
let label: TextLabel;

function createGui() {
  const playerGui = player.WaitForChild("PlayerGui");

  gui = new Instance("BillboardGui");
  gui.Name = "StartStatusUI";
  gui.Size = new UDim2(0, 260, 0, 60);
  gui.StudsOffset = new Vector3(0, 8, 0);
  gui.AlwaysOnTop = true;
  gui.Adornee = startZoneDisplayPart;
  gui.Parent = playerGui;

  label = new Instance("TextLabel");
  label.Size = UDim2.fromScale(1, 1);
  label.BackgroundTransparency = 1;
  label.TextScaled = true;
  label.Font = Enum.Font.GothamBold;
  label.TextColor3 = Color3.fromRGB(255, 255, 255);
  label.Text = "En attente de joueurs...";
  label.Parent = gui;
}

function shouldShowStartText() {
  const teamName = player.Team?.Name;

  return (
    player.Neutral ||
    teamName === undefined ||
    (teamName !== "Blue" &&
      teamName !== "Red" &&
      teamName !== "Spectator")
  );
}

createGui();

RunService.RenderStepped.Connect(() => {
  startZoneDisplayPart.CFrame = startZone.GetPivot();

  if (!gui || gui.Parent === undefined) {
    createGui();
  }

  const canSeeText = shouldShowStartText();

  gui.Enabled = canSeeText;

  if (!canSeeText) return;

  let inGame = false;

  for (const child of startZone.GetDescendants()) {
    if (
      child.IsA("BasePart") &&
      child.Color === Color3.fromRGB(255, 0, 0)
    ) {
      inGame = true;
      break;
    }
  }

  label.Text = inGame ? "PARTIE EN COURS" : "En attente de joueurs...";
});
