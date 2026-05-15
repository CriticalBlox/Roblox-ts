import { ReplicatedStorage } from "@rbxts/services";

export const Remotes = {
  Timer: ReplicatedStorage.WaitForChild("TimerEvent") as RemoteEvent,
};
