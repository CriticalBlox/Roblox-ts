import { Players, Workspace } from "@rbxts/services";

const startZone = Workspace.WaitForChild("StartZone") as Model;
const startHitbox = startZone.WaitForChild("Hitbox") as BasePart;

const originalColors = new Map<BasePart, Color3>();

function getZoneParts() {
  const parts = new Array<BasePart>();

  for (const child of startZone.GetDescendants()) {
    if (child.IsA("BasePart") && child !== startHitbox) {
      parts.push(child);

      if (!originalColors.has(child)) {
        originalColors.set(child, child.Color);
      }
    }
  }

  return parts;
}

export function setStartEnabled(enabled: boolean) {
  startHitbox.CanQuery = enabled;
  startHitbox.CanTouch = false;
  startHitbox.CanCollide = false;
  startHitbox.Transparency = 1;

  for (const part of getZoneParts()) {
    part.CanTouch = enabled;
    part.CanQuery = enabled;
    part.Transparency = enabled ? 0 : 0.5;

    if (enabled) {
      part.Color =
        originalColors.get(part) ??
        Color3.fromRGB(255, 255, 255);
    } else {
      part.Color = Color3.fromRGB(255, 0, 0);
    }
  }
}

export function getStartPlayers() {
  const startPlayers = new Array<Player>();

  const parts = Workspace.GetPartsInPart(startHitbox);

  for (const part of parts) {
    const character = part.Parent;
    if (!character) continue;

    const player = Players.GetPlayerFromCharacter(character);
    if (!player) continue;

    if (player.Team && !player.Neutral) continue;

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