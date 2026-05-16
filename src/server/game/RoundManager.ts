import { Remotes } from "shared/Remotes";
import { Game_Config } from "./GameConfig";
import { setTeam } from "../services/TeamService";
import { teleport } from "../services/SpawnService";
import { getStartCount, getStartPlayers } from "../services/StartService";
import {setSpectator} from "../services/SpectatorService";
import {clearInventory, giveItems} from "../services/InventoryService";
import {clearAllHighlights, highlightEnemiesFor} from "../services/HighlightService";

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

      if (teamName) {
        setTeam(player, teamName);
      }
    }
  }

  private startRound() {
    Remotes.Score.FireAllClients("show");
    this.updateScoreUI();
    this.restoreTeams();

    for (const player of this.gamePlayers) {
      player.LoadCharacterAsync();
    }

    for (const player of this.gamePlayers) {
      teleport(player);
      giveItems(player, ["Sword", "M4"]);
    }

    this.setupDeaths();
  }

  private runRound(): boolean {
    let t = Game_Config.Round_Time;
    let highlightEnabled = false;
    const highlightTime = Game_Config.Round_Time * 0.3;

    while (t > 0) {
      Remotes.Timer.FireAllClients("round", t, this.currentRound);

      if (
        this.isTeamEliminated("Blue") ||
        this.isTeamEliminated("Red")
      ) {
        break;
      }

      if (!highlightEnabled && t <= highlightTime) {
        highlightEnabled = true;

        for (const player of this.gamePlayers) {
          highlightEnemiesFor(player);
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
      if (player.Team?.Name !== teamName) continue;

      const character = player.Character;
      if (!character) continue;

      const humanoid = character.FindFirstChild("Humanoid") as Humanoid;

      if (!humanoid) continue;

      if (humanoid.Health > 0) {
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

      if (player.Team?.Name === "Blue") {
        bluePlayers++;
      }

      if (player.Team?.Name === "Red") {
        redPlayers++;
      }

      const character = player.Character;
      if (!character) continue;

      const humanoid = character.FindFirstChild("Humanoid") as Humanoid;
      if (!humanoid || humanoid.Health <= 0) continue;

      if (player.Team?.Name === "Blue") {
        blueAlive++;
        blueHealth += humanoid.Health;
      }

      if (player.Team?.Name === "Red") {
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
      this.updateScoreUI();

      for (let round = 1; round <= Game_Config.Rounds; round++) {
        this.currentRound = round;
        this.startRound();
        this.runRound();
      }

      Remotes.Score.FireAllClients("hide");
      Remotes.Timer.FireAllClients("hide");

      this.currentRound = 0;
      this.gamePlayers.clear();

      task.wait(1);
    }
  }
}
