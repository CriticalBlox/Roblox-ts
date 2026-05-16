import { Players, Workspace } from "@rbxts/services";

const startZone = Workspace.WaitForChild("StartZone") as BasePart;

const startStatusGui = new Instance("BillboardGui");
startStatusGui.Size = new UDim2(0, 260, 0, 60);
startStatusGui.StudsOffset = new Vector3(0, 5, 0);
startStatusGui.AlwaysOnTop = true;
startStatusGui.Adornee = startZone;
startStatusGui.Parent = startZone;

const statusLabel = new Instance("TextLabel");
statusLabel.Size = UDim2.fromScale(1, 1);
statusLabel.BackgroundTransparency = 1;
statusLabel.TextScaled = true;
statusLabel.Font = Enum.Font.GothamBold;
statusLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
statusLabel.Parent = startStatusGui;

export function setStartEnabled(enabled: boolean) {
  startZone.CanTouch = enabled;
  startZone.CanQuery = enabled;
  startZone.Transparency = enabled ? 0 : 0.5;

  if (enabled) {
    startZone.Color = Color3.fromRGB(44, 101, 29);
    statusLabel.Text = "En attente de joueurs...";
  } else {
    startZone.Color = Color3.fromRGB(255, 0, 0);
    statusLabel.Text = "PARTIE EN COURS";
  }
}

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

setStartEnabled(true);