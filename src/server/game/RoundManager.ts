import { Players } from "@rbxts/services";
import { Remotes } from "shared/Remotes";
import {Game_Config} from "./GameConfig";
import { setTeam } from "../services/TeamService";
import { teleport } from "../services/SpawnService";

export class RoundManager {
  private currentRound = 0;

  public start() {
    task.spawn(() => {
      this.loop();
    });
  }

  private hasEnoughPlayers() {
    return Players.GetPlayers().size() >= Game_Config.Min_Payers;
  }

  private intermission(): boolean {
    let t = Game_Config.Intermission;

    while (t > 0) {
      if (!this.hasEnoughPlayers()) {
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
    let toggle = true;

    for (const player of Players.GetPlayers()) {
      setTeam(player, toggle ? "Blue" : "Red");
      toggle = !toggle;
    }
  }

  private startRound() {
    this.assignTeams();

    for (const player of Players.GetPlayers()) {
      teleport(player);
    }
  }

  private runRound(): boolean {
    let t = Game_Config.Round_Time;

    while (t > 0) {
      if (!this.hasEnoughPlayers()) {
        Remotes.Timer.FireAllClients("hide");
        return false;
      }

      Remotes.Timer.FireAllClients(
        "round",
        t,
        this.currentRound,
      );

      task.wait(1);
      t--;
    }

    Remotes.Timer.FireAllClients("hide");

    return true;
  }

  private loop() {
    while (true) {
      const ok = this.intermission();

      if (!ok) {
        task.wait(1);
        continue;
      }

      for (let round = 1; round <= Game_Config.Rounds; round++) {
        this.currentRound = round;

        this.startRound();

        const finished = this.runRound();

        if (!finished) {
          break;
        }

      }

      this.currentRound = 0;
    }
  }
}
