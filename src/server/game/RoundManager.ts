import { Remotes } from "shared/Remotes";
import { Game_Config } from "./GameConfig";
import { setTeam } from "../services/TeamService";
import { teleport } from "../services/SpawnService";
import {getStartCount, getStartPlayers, setStartEnabled} from "../services/StartService";
import { setSpectator } from "../services/SpectatorService";
import { clearInventory, giveItems } from "../services/InventoryService";
import { clearAllHighlights, highlightEnemiesFor } from "../services/HighlightService";
import { getDeaths, getKills, resetKills, trackDeath } from "../services/KillService";

export class RoundManager {
  private blueScore = 0;
  private redScore = 0;
  private currentRound = 0;
  private gamePlayers = new Array<Player>();
  private originalTeams = new Map<Player, "Blue" | "Red">();

  public start() {
    task.spawn(() => {
      this.loop();
    });
  }

  private hasEnoughStartPlayers() {
    return getStartCount() >= Game_Config.Min_Payers;
  }

  private intermission(): boolean {
    let t = Game_Config.Intermission;

    while (t > 0) {
      if (!this.hasEnoughStartPlayers()) {
        Remotes.Timer.FireAllClients("hide");
        task.wait(1);
        return false;
      }

      Remotes.Timer.FireAllClients("intermission", t);
      task.wait(1);
      t--;
    }

    Remotes.Timer.FireAllClients("hide");
    return true;
  }

  private assignTeams() {
    this.gamePlayers = getStartPlayers();
    this.originalTeams.clear();

    for (let i = 0; i < this.gamePlayers.size(); i++) {
      const player = this.gamePlayers[i];
      const teamName = i % 2 === 0 ? "Blue" : "Red";

      this.originalTeams.set(player, teamName);
      setTeam(player, teamName);
    }
  }

  private restoreTeams() {
    for (const player of this.gamePlayers) {
      const teamName = this.originalTeams.get(player);

      if (teamName && player.Parent) {
        setTeam(player, teamName);
      }
    }
  }

  private startRound() {
    Remotes.Score.FireAllClients("show");
    this.updateScoreUI();

    Remotes.Timer.FireAllClients("round", Game_Config.Round_Time, this.currentRound);

    this.restoreTeams();

    for (const player of this.gamePlayers) {
      if (player.Parent) {
        player.LoadCharacterAsync();
      }
    }

    task.wait(1);

    for (const player of this.gamePlayers) {
      if (!player.Parent) continue;

      teleport(player);
      giveItems(player, ["Sword", "M4"]);
    }

    task.wait(0.2);

    for (const player of this.gamePlayers) {
      if (player.Parent) {
        trackDeath(player);
      }
    }

    this.setupDeaths();
  }

  private hasTeamDisconnected(teamName: "Blue" | "Red") {
    let count = 0;

    for (const player of this.gamePlayers) {
      if (!player.Parent) continue;

      const originalTeam = this.originalTeams.get(player);

      if (originalTeam === teamName) {
        count++;
      }
    }

    return count <= 0;
  }

  private runRound(): boolean {
    let t = Game_Config.Round_Time;
    let highlightEnabled = false;
    const highlightTime = Game_Config.Round_Time * 0.3;

    while (t > 0) {
      Remotes.Timer.FireAllClients("round", t, this.currentRound);

      if (
        this.hasTeamDisconnected("Blue") ||
        this.hasTeamDisconnected("Red")
      ) {
        Remotes.Timer.FireAllClients("hide");
        clearAllHighlights();
        return false;
      }

      if (
        this.isTeamEliminated("Blue") ||
        this.isTeamEliminated("Red")
      ) {
        break;
      }

      if (!highlightEnabled && t <= highlightTime) {
        highlightEnabled = true;

        for (const player of this.gamePlayers) {
          if (player.Parent) {
            highlightEnemiesFor(player);
          }
        }
      }

      task.wait(1);
      t--;
    }

    this.giveRoundWin();

    Remotes.Timer.FireAllClients("hide");
    clearAllHighlights();

    return true;
  }

  private setupDeaths() {
    for (const player of this.gamePlayers) {
      if (!player.Parent) continue;

      const character = player.Character;
      if (!character) continue;

      const humanoid = character.FindFirstChild("Humanoid") as Humanoid;
      if (!humanoid) continue;

      humanoid.Died.Once(() => {
        setSpectator(player);
        clearInventory(player);
      });
    }
  }

  private isTeamEliminated(teamName: "Blue" | "Red") {
    let alive = 0;

    for (const player of this.gamePlayers) {
      if (!player.Parent) continue;

      const originalTeam = this.originalTeams.get(player);
      if (originalTeam !== teamName) continue;

      const character = player.Character;
      if (!character) continue;

      const humanoid = character.FindFirstChild("Humanoid") as Humanoid;
      if (!humanoid) continue;

      if (humanoid.Health > 0 && player.Team?.Name === teamName) {
        alive++;
      }
    }

    return alive <= 0;
  }

  private updateScoreUI() {
    Remotes.Score.FireAllClients("update", this.blueScore, this.redScore);
  }

  private giveRoundWin() {
    let blueAlive = 0;
    let redAlive = 0;

    let bluePlayers = 0;
    let redPlayers = 0;

    let blueHealth = 0;
    let redHealth = 0;

    for (const player of this.gamePlayers) {
      if (!player.Parent) continue;

      const originalTeam = this.originalTeams.get(player);

      if (originalTeam === "Blue") {
        bluePlayers++;
      }

      if (originalTeam === "Red") {
        redPlayers++;
      }

      const character = player.Character;
      if (!character) continue;

      const humanoid = character.FindFirstChild("Humanoid") as Humanoid;
      if (!humanoid || humanoid.Health <= 0) continue;

      if (originalTeam === "Blue") {
        blueAlive++;
        blueHealth += humanoid.Health;
      }

      if (originalTeam === "Red") {
        redAlive++;
        redHealth += humanoid.Health;
      }
    }

    if (bluePlayers <= 0 && redPlayers > 0) {
      this.redScore++;
      this.updateScoreUI();
      return;
    }

    if (redPlayers <= 0 && bluePlayers > 0) {
      this.blueScore++;
      this.updateScoreUI();
      return;
    }

    if (blueAlive > redAlive) {
      this.blueScore++;
      this.updateScoreUI();
      return;
    }

    if (redAlive > blueAlive) {
      this.redScore++;
      this.updateScoreUI();
      return;
    }

    if (blueHealth > redHealth) {
      this.blueScore++;
      this.updateScoreUI();
      return;
    }

    if (redHealth > blueHealth) {
      this.redScore++;
      this.updateScoreUI();
      return;
    }

    this.updateScoreUI();
  }

  private sendEndGameUI() {
    this.restoreTeams();

    const playersData = new Array<{
      name: string;
      team: string;
      kills: number;
      deaths: number;
    }>();

    for (const player of this.gamePlayers) {
      playersData.push({
        name: player.Name,
        team: this.originalTeams.get(player) ?? "None",
        kills: getKills(player),
        deaths: getDeaths(player),
      });
    }

    let winner = "Draw";

    if (this.blueScore > this.redScore) {
      winner = "Blue";
    }

    if (this.redScore > this.blueScore) {
      winner = "Red";
    }

    Remotes.EndGame.FireAllClients(
      winner,
      playersData,
      this.blueScore,
      this.redScore,
    );
  }

  private resetPlayersAfterGame() {
    for (const player of this.gamePlayers) {
      if (!player.Parent) continue;
      clearInventory(player);

      player.Team = undefined;
      player.Neutral = true;

      teleport(player);
    }
  }

  private loop() {
    while (true) {
      Remotes.Score.FireAllClients("hide");

      const ok = this.intermission();

      if (!ok) {
        task.wait(1);
        continue;
      }

      this.blueScore = 0;
      this.redScore = 0;
      this.currentRound = 0;

      this.assignTeams();

      setStartEnabled(false);

      resetKills(this.gamePlayers);
      this.updateScoreUI();

      for (let round = 1; round <= Game_Config.Rounds; round++) {
        this.currentRound = round;

        this.startRound();

        const finished = this.runRound();

        if (!finished) {
          break;
        }
      }

      this.restoreTeams();
      this.sendEndGameUI();

      task.wait(1);

      this.resetPlayersAfterGame();

      task.wait(2);

      setStartEnabled(true);

      Remotes.Score.FireAllClients("hide");
      Remotes.Timer.FireAllClients("hide");

      this.currentRound = 0;
      this.gamePlayers.clear();
      this.originalTeams.clear();

      task.wait(1);
    }
  }
}
