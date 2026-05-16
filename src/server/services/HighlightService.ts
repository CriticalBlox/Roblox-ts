export function clearHighlights(player: Player) {
  for (const otherPlayer of game.GetService("Players").GetPlayers()) {
    const character = otherPlayer.Character;
    if (!character) continue;

    const highlightName = `EnemyHighlight_${player.UserId}`;
    const highlight = character.FindFirstChild(highlightName);

    if (highlight) {
      highlight.Destroy();
    }
  }
}

export function highlightEnemiesFor(player: Player) {
  const playerTeam = player.Team;
  if (!playerTeam) return;

  if (
    playerTeam.Name !== "Blue" &&
    playerTeam.Name !== "Red"
  ) {
    return;
  }

  for (const enemy of game.GetService("Players").GetPlayers()) {
    if (enemy === player) continue;

    const enemyTeam = enemy.Team;
    if (!enemyTeam) continue;

    if (
      enemyTeam.Name !== "Blue" &&
      enemyTeam.Name !== "Red"
    ) {
      continue;
    }

    if (enemyTeam === playerTeam) {
      continue;
    }

    const character = enemy.Character;
    if (!character) continue;

    const existing = character.FindFirstChild(
      `EnemyHighlight_${player.UserId}`,
    );

    if (existing) continue;

    const highlight = new Instance("Highlight");

    highlight.Name = `EnemyHighlight_${player.UserId}`;
    highlight.FillTransparency = 0.5;
    highlight.OutlineTransparency = 0;

    if (enemyTeam.Name === "Blue") {
      highlight.FillColor = Color3.fromRGB(0, 85, 255);
    }

    if (enemyTeam.Name === "Red") {
      highlight.FillColor = Color3.fromRGB(255, 0, 0);
    }

    highlight.Adornee = character;
    highlight.Parent = character;
  }
}

export function clearAllHighlights() {
  for (const player of game.GetService("Players").GetPlayers()) {
    clearHighlights(player);
  }
}
