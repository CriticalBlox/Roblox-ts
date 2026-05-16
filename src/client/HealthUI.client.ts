import { Players, RunService } from "@rbxts/services";
import { Remotes } from "shared/Remotes";

const player = Players.LocalPlayer;
const gui = player.WaitForChild("PlayerGui");

let roundActive = false;

const screen = new Instance("ScreenGui");
screen.Name = "HealthUI";
screen.ResetOnSpawn = false;
screen.Enabled = false;
screen.Parent = gui;

const background = new Instance("Frame");
background.Size = new UDim2(0, 250, 0, 25);
background.Position = new UDim2(0, 20, 1, -50);
background.BackgroundColor3 = Color3.fromRGB(255, 0, 0);
background.Parent = screen;

const bar = new Instance("Frame");
bar.Size = new UDim2(1, 0, 1, 0);
bar.BackgroundColor3 = Color3.fromRGB(0, 255, 0);
bar.Parent = background;

const text = new Instance("TextLabel");
text.Size = new UDim2(1, 0, 1, 0);
text.BackgroundTransparency = 1;
text.TextColor3 = Color3.fromRGB(255, 255, 255);
text.TextScaled = true;
text.Text = "200 / 200";
text.Parent = background;

function isPlayingTeam() {
  const teamName = player.Team?.Name;
  return teamName === "Blue" || teamName === "Red";
}

function updateHealth() {
  const character = player.Character;
  const humanoid = character?.FindFirstChild("Humanoid") as Humanoid;

  if (!roundActive || !isPlayingTeam() || !humanoid || humanoid.Health <= 0) {
    screen.Enabled = false;
    return;
  }

  screen.Enabled = true;

  const health = math.max(0, humanoid.Health);
  const maxHealth = math.max(1, humanoid.MaxHealth);
  const percent = health / maxHealth;

  bar.Size = new UDim2(percent, 0, 1, 0);
  text.Text = `${math.floor(health)} / ${math.floor(maxHealth)}`;
}

Remotes.Timer.OnClientEvent.Connect((state: string) => {
  if (state === "round") {
    roundActive = true;
    updateHealth();
    return;
  }

  if (state === "hide" || state === "intermission") {
    roundActive = false;
    updateHealth();
  }
});

player.GetPropertyChangedSignal("Team").Connect(updateHealth);
player.CharacterAdded.Connect(() => {
  task.wait(0.2);
  updateHealth();
});

RunService.RenderStepped.Connect(updateHealth);
