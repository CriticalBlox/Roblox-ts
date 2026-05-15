import { Players } from "@rbxts/services";
import { Remotes } from "shared/Remotes";

const player = Players.LocalPlayer;
const gui = player.WaitForChild("PlayerGui");

const screen = new Instance("ScreenGui");
screen.Name = "TimerUI";
screen.Parent = gui;

const label = new Instance("TextLabel");
label.Size = new UDim2(0, 350, 0, 70);
label.Position = new UDim2(0.5, -175, 0, -10);
label.BackgroundTransparency = 0.3;
label.TextScaled = true;
label.Visible = false;
label.Parent = screen;

function formatTime(seconds: number) {
  const minutes = math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
}

Remotes.Timer.OnClientEvent.Connect(
  (state: string, time?: number, round?: number) => {
    if (state === "hide") {
      label.Visible = false;
      return;
    }

    if (!typeIs(time, "number")) return;

    label.Visible = true;

    if (state === "intermission") {
      label.Text = `Début dans : ${time}s`;
      return;
    }

    if (state === "round") {
      label.Text = `Manche ${round}\n${formatTime(time)}`;
    }
  },
);
