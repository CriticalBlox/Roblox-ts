import { ServerStorage } from "@rbxts/services";

const toolsFolder = ServerStorage.WaitForChild("Tools");

export function clearInventory(player: Player) {
  const backpack = player.FindFirstChild("Backpack") as Backpack;
  const character = player.Character;

  if (backpack) {
    for (const item of backpack.GetChildren()) {
      item.Destroy();
    }
  }

  if (character) {
    for (const item of character.GetChildren()) {
      if (item.IsA("Tool")) {
        item.Destroy();
      }
    }
  }
}

export function giveItem(player: Player, itemName: string) {
  const backpack = player.WaitForChild("Backpack") as Backpack;
  const item = toolsFolder.FindFirstChild(itemName) as Tool;

  if (!item) {
    warn(`Item introuvable : ${itemName}`);
    return;
  }

  const clone = item.Clone();
  clone.Parent = backpack;
}

export function giveItems(player: Player, itemNames: string[]) {
  clearInventory(player);

  for (const itemName of itemNames) {
    giveItem(player, itemName);
  }
}
