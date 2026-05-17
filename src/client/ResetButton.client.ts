import { StarterGui } from "@rbxts/services";

function disableRespawnButton() {
  while (true) {
    pcall(() => {
      StarterGui.SetCore("ResetButtonCallback", false);
    });

    task.wait(1);
  }
}

task.spawn(disableRespawnButton);
