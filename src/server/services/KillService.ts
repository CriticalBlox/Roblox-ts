const kills = new Map<Player, number>();
const deaths = new Map<Player, number>();
const tracked = new Map<Player, RBXScriptConnection>();

export function resetKills(players: Player[]) {
  kills.clear();
  deaths.clear();

  for (const [, connection] of tracked) {
    connection.Disconnect();
  }

  tracked.clear();

  for (const player of players) {
    kills.set(player, 0);
    deaths.set(player, 0);
  }
}

export function addKill(player: Player) {
  kills.set(player, (kills.get(player) ?? 0) + 1);
}

export function addDeath(player: Player) {
  deaths.set(player, (deaths.get(player) ?? 0) + 1);
}

export function getKills(player: Player) {
  return kills.get(player) ?? 0;
}

export function getDeaths(player: Player) {
  return deaths.get(player) ?? 0;
}

export function trackDeath(victim: Player) {
  const oldConnection = tracked.get(victim);

  if (oldConnection) {
    oldConnection.Disconnect();
  }

  const character = victim.Character;
  if (!character) return;

  const humanoid = character.WaitForChild("Humanoid") as Humanoid;

  const connection = humanoid.Died.Once(() => {
    addDeath(victim);

    const creator = humanoid.FindFirstChild("creator") as ObjectValue;
    const killer = creator?.Value;

    if (!killer || !killer.IsA("Player")) return;
    if (killer === victim) return;

    addKill(killer);
  });

  tracked.set(victim, connection);
}