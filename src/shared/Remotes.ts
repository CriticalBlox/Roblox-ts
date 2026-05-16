import { ReplicatedStorage } from "@rbxts/services";

export const Remotes = {
  Timer: ReplicatedStorage.WaitForChild("TimerEvent") as RemoteEvent,
  Score: ReplicatedStorage.WaitForChild("ScoreEvent") as RemoteEvent,
  EndGame: ReplicatedStorage.WaitForChild("EndGameEvent") as RemoteEvent,
};
