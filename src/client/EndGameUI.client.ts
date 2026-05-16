import {Players, UserInputService} from "@rbxts/services";
import { Remotes } from "shared/Remotes";

const player = Players.LocalPlayer;
const gui = player.WaitForChild("PlayerGui");

function freeMouse() {
  UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
  UserInputService.MouseIconEnabled = true;
}

type PlayerData = {
  name: string;
  team: string;
  kills: number;
  deaths?: number;
};

const screen = new Instance("ScreenGui");
screen.Name = "EndGameUI";
screen.ResetOnSpawn = false;
screen.Enabled = false;
screen.IgnoreGuiInset = true;
screen.Parent = gui;

const main = new Instance("Frame");
main.Size = new UDim2(0.9, 0, 0.8, 0);
main.Position = new UDim2(0.5, 0, 0.5, 0);
main.AnchorPoint = new Vector2(0.5, 0.5);
main.BackgroundColor3 = Color3.fromRGB(8, 12, 18);
main.BackgroundTransparency = 0.05;
main.BorderSizePixel = 0;
main.Parent = screen;

const mainSize = new Instance("UISizeConstraint");
mainSize.MaxSize = new Vector2(1000, 620);
mainSize.MinSize = new Vector2(320, 260);
mainSize.Parent = main;

const mainStroke = new Instance("UIStroke");
mainStroke.Thickness = 2;
mainStroke.Color = Color3.fromRGB(90, 120, 150);
mainStroke.Parent = main;

const closeButton = new Instance("TextButton");
closeButton.Modal = true;
closeButton.Size = new UDim2(0.04, 0, 0.07, 0);
closeButton.Position = new UDim2(0.98, 0, 0.02, 0);
closeButton.AnchorPoint = new Vector2(1, 0);
closeButton.BackgroundColor3 = Color3.fromRGB(255, 60, 60);
closeButton.TextColor3 = Color3.fromRGB(255, 255, 255);
closeButton.Font = Enum.Font.GothamBlack;
closeButton.TextScaled = true;
closeButton.Text = "X";
closeButton.Parent = main;

closeButton.MouseButton1Click.Connect(() => {
  screen.Enabled = false;
});

const title = new Instance("TextLabel");
title.Size = new UDim2(1, 0, 0.15, 0);
title.BackgroundTransparency = 1;
title.Font = Enum.Font.GothamBlack;
title.TextScaled = true;
title.TextStrokeTransparency = 0.25;
title.TextColor3 = Color3.fromRGB(0, 170, 255);
title.Text = "Victory";
title.Parent = main;

const scoreLabel = new Instance("TextLabel");
scoreLabel.Size = new UDim2(1, 0, 0.1, 0);
scoreLabel.Position = new UDim2(0, 0, 0.15, 0);
scoreLabel.BackgroundTransparency = 1;
scoreLabel.Font = Enum.Font.GothamBlack;
scoreLabel.TextScaled = true;
scoreLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
scoreLabel.Text = "0 - 0";
scoreLabel.Parent = main;

function createPanel(position: UDim2, color: Color3) {
  const panel = new Instance("Frame");
  panel.Size = new UDim2(0.44, 0, 0.62, 0);
  panel.Position = position;
  panel.BackgroundColor3 = color.Lerp(Color3.fromRGB(0, 0, 0), 0.82);
  panel.BorderSizePixel = 0;
  panel.Parent = main;

  const stroke = new Instance("UIStroke");
  stroke.Thickness = 2;
  stroke.Color = color;
  stroke.Parent = panel;

  const result = new Instance("TextLabel");
  result.Size = new UDim2(1, 0, 0.14, 0);
  result.BackgroundTransparency = 1;
  result.Font = Enum.Font.GothamBlack;
  result.TextScaled = true;
  result.TextColor3 = color;
  result.Text = "VICTORY";
  result.Parent = panel;

  const header = new Instance("Frame");
  header.Size = new UDim2(1, -10, 0.16, 0);
  header.Position = new UDim2(0, 5, 0.14, 0);
  header.BackgroundColor3 = color.Lerp(Color3.fromRGB(0, 0, 0), 0.35);
  header.BorderSizePixel = 0;
  header.Parent = panel;

  const list = new Instance("Frame");
  list.Size = new UDim2(1, -10, 0.68, 0);
  list.Position = new UDim2(0, 5, 0.3, 0);
  list.BackgroundTransparency = 1;
  list.Parent = panel;

  const layout = new Instance("UIListLayout");
  layout.Parent = list;

  const columns = [
    ["Pseudo", 0, 0.5],
    ["Kill", 0.5, 0.25],
    ["Mort", 0.75, 0.25],
  ] as const;

  for (const [text, x, width] of columns) {
    const label = new Instance("TextLabel");
    label.Size = new UDim2(width, 0, 1, 0);
    label.Position = new UDim2(x, 0, 0, 0);
    label.BackgroundTransparency = 1;
    label.Font = Enum.Font.GothamBold;
    label.TextScaled = false;
    label.TextSize = 30;
    label.TextColor3 = Color3.fromRGB(255, 255, 255);
    label.Text = text;
    label.Parent = header;
  }

  return { list, result };
}

const bluePanel = createPanel(new UDim2(0.04, 0, 0.33, 0), Color3.fromRGB(0, 120, 255));
const redPanel = createPanel(new UDim2(0.52, 0, 0.33, 0), Color3.fromRGB(255, 45, 45));

function createRow(parent: Frame, data: PlayerData) {
  const row = new Instance("Frame");
  row.Size = new UDim2(1, 0, 0.15, 0);
  row.BackgroundTransparency = 1;
  row.Parent = parent;

  const pseudo = new Instance("TextLabel");
  pseudo.Size = new UDim2(0.5, 0, 1, 0);
  pseudo.BackgroundTransparency = 1;
  pseudo.Font = Enum.Font.GothamBold;
  pseudo.TextSize = 22;
  pseudo.TextColor3 = Color3.fromRGB(255, 255, 255);
  pseudo.TextXAlignment = Enum.TextXAlignment.Left;
  pseudo.Text = data.name;
  pseudo.Parent = row;

  const padding = new Instance("UIPadding");
  padding.PaddingLeft = new UDim(0.04, 0);
  padding.Parent = pseudo;

  const kill = new Instance("TextLabel");
  kill.Size = new UDim2(0.25, 0, 1, 0);
  kill.Position = new UDim2(0.5, 0, 0, 0);
  kill.BackgroundTransparency = 1;
  kill.Font = Enum.Font.GothamBold;
  kill.TextSize = 22;
  kill.TextColor3 = Color3.fromRGB(255, 255, 255);
  kill.Text = tostring(data.kills);
  kill.Parent = row;

  const death = new Instance("TextLabel");
  death.Size = new UDim2(0.25, 0, 1, 0);
  death.Position = new UDim2(0.75, 0, 0, 0);
  death.BackgroundTransparency = 1;
  death.Font = Enum.Font.GothamBold;
  death.TextSize = 22;
  death.TextColor3 = Color3.fromRGB(255, 255, 255);
  death.Text = tostring(data.deaths ?? 0);
  death.Parent = row;
}

function clearList(list: Frame) {
  for (const child of list.GetChildren()) {
    if (child.IsA("Frame")) child.Destroy();
  }
}

Remotes.EndGame.OnClientEvent.Connect(
  (winner: string, playersData: PlayerData[], blueScore?: number, redScore?: number) => {
    freeMouse();
    screen.Enabled = true;

    clearList(bluePanel.list);
    clearList(redPanel.list);

    scoreLabel.Text = `${blueScore ?? 0} - ${redScore ?? 0}`;

    const myTeam = player.Team?.Name;

    if (winner === myTeam) {
      title.Text = "Victory";
      title.TextColor3 = Color3.fromRGB(0, 170, 255);
    } else if (winner === "Draw") {
      title.Text = "Draw";
      title.TextColor3 = Color3.fromRGB(255, 255, 255);
    } else {
      title.Text = "Lose";
      title.TextColor3 = Color3.fromRGB(255, 60, 60);
    }

    bluePanel.result.Text = winner === "Blue" ? "VICTORY" : "LOSE";
    redPanel.result.Text = winner === "Red" ? "VICTORY" : "LOSE";

    if (winner === "Draw") {
      bluePanel.result.Text = "DRAW";
      redPanel.result.Text = "DRAW";
    }

    for (const data of playersData) {
      if (data.team === "Blue") createRow(bluePanel.list, data);
      if (data.team === "Red") createRow(redPanel.list, data);
    }

    task.delay(30, () => {
      screen.Enabled = false;
    });
  },
);