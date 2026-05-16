import { Players } from "@rbxts/services";
import { Remotes } from "shared/Remotes";
import { Game_Config } from "./GameConfig";
import { setTeam } from "../services/TeamService";
import { teleport } from "../services/SpawnService";
import { getStartCount, getStartPlayers } from "../services/StartService";

export class RoundManager {
  private blueScore = 0;
  private redScore = 0;
  private currentRound = 0;
  private gamePlayers = new Array<Player>();

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
      setTeam(player, i % 2 === 0 ? "Blue" : "Red");
    }
  }

  private startRound() {
    this.assignTeams();

    Remotes.Score.FireAllClients("show");
    this.updateScoreUI();

    for (const player of this.gamePlayers) {
      teleport(player);
    }
  }

  private runRound(): boolean {
    let t = Game_Config.Round_Time;

    while (t > 0) {
      Remotes.Timer.FireAllClients("round", t, this.currentRound);

      task.wait(1);
      t--;
    }

    this.giveRoundWin();
    Remotes.Timer.FireAllClients("hide");

    return true;
  }

  private updateScoreUI() {
    Remotes.Score.FireAllClients("update", this.blueScore, this.redScore);
  }

  private giveRoundWin() {
    let blueAlive = 0;
    let redAlive = 0;

    for (const player of this.gamePlayers) {
      const character = player.Character;
      if (!character) continue;

      const humanoid = character.FindFirstChild("Humanoid") as Humanoid;
      if (!humanoid || humanoid.Health <= 0) continue;

      if (player.Team?.Name === "Blue") blueAlive++;
      if (player.Team?.Name === "Red") redAlive++;
    }

    if (blueAlive > redAlive) this.blueScore++;
    if (redAlive > blueAlive) this.redScore++;

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
      this.updateScoreUI();

      for (let round = 1; round <= Game_Config.Rounds; round++) {
        this.currentRound = round;

        this.startRound();
        this.runRound();
      }

      Remotes.Score.FireAllClients("hide");
      this.currentRound = 0;
      this.gamePlayers.clear();
    }
  }
}
