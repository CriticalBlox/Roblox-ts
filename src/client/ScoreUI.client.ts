import { Players, ReplicatedStorage } from "@rbxts/services";

const player = Players.LocalPlayer;
const gui = player.WaitForChild("PlayerGui");

const scoreEvent = ReplicatedStorage.WaitForChild("ScoreEvent") as RemoteEvent;

const screen = new Instance("ScreenGui");
screen.Name = "ScoreUI";
screen.Enabled = false;
screen.Parent = gui;

const blueLabel = new Instance("TextLabel");
blueLabel.Size = new UDim2(0, 200, 0, 50);
blueLabel.Position = new UDim2(0, 20, 0, -10);
blueLabel.BackgroundColor3 = Color3.fromRGB(0, 85, 255);
blueLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
blueLabel.TextScaled = true;
blueLabel.Text = "Blue : 0";
blueLabel.Parent = screen;

const redLabel = new Instance("TextLabel");
redLabel.Size = new UDim2(0, 200, 0, 50);
redLabel.Position = new UDim2(1, -220, 0, -10);
redLabel.BackgroundColor3 = Color3.fromRGB(255, 0, 0);
redLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
redLabel.TextScaled = true;
redLabel.Text = "Red : 0";
redLabel.Parent = screen;

scoreEvent.OnClientEvent.Connect((state: string, blueScore?: number, redScore?: number) => {
  if (state === "hide") {
    screen.Enabled = false;
    return;
  }

  if (state === "show") {
    screen.Enabled = true;
  }

  if (state === "update" && typeIs(blueScore, "number") && typeIs(redScore, "number")) {
    screen.Enabled = true;
    blueLabel.Text = `Blue : ${blueScore}`;
    redLabel.Text = `Red : ${redScore}`;
  }
});
