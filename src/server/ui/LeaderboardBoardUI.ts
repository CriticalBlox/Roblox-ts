import { Workspace } from "@rbxts/services";
import {LeaderboardPlayer} from "../../shared/interfaces/Leaderboard";


const board = Workspace.WaitForChild("LeaderBoard") as BasePart;

const surfaceGui = new Instance("SurfaceGui");
surfaceGui.Name = "LeaderboardSurfaceGui";
surfaceGui.Face = Enum.NormalId.Front;
surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
surfaceGui.PixelsPerStud = 55;
surfaceGui.Parent = board;

const main = new Instance("Frame");
main.Size = UDim2.fromScale(1, 1);
main.BackgroundColor3 = Color3.fromRGB(30, 35, 45);
main.BorderSizePixel = 0;
main.Parent = surfaceGui;

const header = new Instance("Frame");
header.Size = new UDim2(1, 0, 0, 70);
header.BackgroundColor3 = Color3.fromRGB(20, 25, 35);
header.BorderSizePixel = 0;
header.Parent = main;

const headerCorner = new Instance("UICorner");
headerCorner.CornerRadius = new UDim(0, 10);
headerCorner.Parent = header;

function createHeaderText(
  text: string,
  position: UDim2,
  size: UDim2,
) {
  const label = new Instance("TextLabel");

  label.BackgroundTransparency = 1;
  label.Position = position;
  label.Size = size;

  label.Font = Enum.Font.GothamBlack;
  label.TextColor3 = Color3.fromRGB(255, 255, 255);
  label.TextScaled = true;

  label.Text = text;

  label.Parent = header;
}

createHeaderText("RANK", new UDim2(0, 0, 0, 0), new UDim2(0.15, 0, 1, 0));
createHeaderText("PSEUDO", new UDim2(0.15, 0, 0, 0), new UDim2(0.35, 0, 1, 0));
createHeaderText("KILLS", new UDim2(0.5, 0, 0, 0), new UDim2(0.15, 0, 1, 0));
createHeaderText("DEATHS", new UDim2(0.65, 0, 0, 0), new UDim2(0.15, 0, 1, 0));
createHeaderText("WINS", new UDim2(0.8, 0, 0, 0), new UDim2(0.2, 0, 1, 0));

const content = new Instance("Frame");
content.Size = new UDim2(1, -20, 1, -90);
content.Position = new UDim2(0, 10, 0, 80);
content.BackgroundTransparency = 1;
content.Parent = main;

const layout = new Instance("UIListLayout");
layout.Padding = new UDim(0, 10);
layout.FillDirection = Enum.FillDirection.Vertical;
layout.Parent = content;

function createRow(index: number, player: LeaderboardPlayer) {
  const row = new Instance("Frame");

  row.Size = new UDim2(1, 0, 0, 80);

  row.BackgroundColor3 =
    index === 0
      ? Color3.fromRGB(255, 170, 25)
      : index === 1
        ? Color3.fromRGB(170, 180, 190)
        : index === 2
          ? Color3.fromRGB(210, 135, 90)
          : Color3.fromRGB(130, 165, 215);

  row.BorderSizePixel = 0;
  row.Parent = content;

  const corner = new Instance("UICorner");
  corner.CornerRadius = new UDim(0, 12);
  corner.Parent = row;

  function createCell(
    text: string,
    position: UDim2,
    size: UDim2,
  ) {
    const label = new Instance("TextLabel");

    label.BackgroundTransparency = 1;
    label.Position = position;
    label.Size = size;

    label.Font = Enum.Font.GothamBold;
    label.TextColor3 = Color3.fromRGB(40, 40, 40);
    label.TextScaled = true;

    label.Text = text;

    label.Parent = row;
  }

  createCell(`${index + 1}`, new UDim2(0, 0, 0, 0), new UDim2(0.15, 0, 1, 0));

  createCell(
    player.pseudo,
    new UDim2(0.15, 0, 0, 0),
    new UDim2(0.35, 0, 1, 0),
  );

  createCell(
    tostring(player.kills),
    new UDim2(0.5, 0, 0, 0),
    new UDim2(0.15, 0, 1, 0),
  );

  createCell(
    tostring(player.deaths),
    new UDim2(0.65, 0, 0, 0),
    new UDim2(0.15, 0, 1, 0),
  );

  createCell(
    tostring(player.win_total),
    new UDim2(0.8, 0, 0, 0),
    new UDim2(0.2, 0, 1, 0),
  );
}

function clearRows() {
  for (const child of content.GetChildren()) {
    if (child.IsA("Frame")) {
      child.Destroy();
    }
  }
}

export function renderLeaderboard(players: LeaderboardPlayer[]) {
  clearRows();

  for (let i = 0; i < math.min(players.size(), 10); i++) {
    createRow(i, players[i]);
  }
}
