import {RoundManager} from "./game/RoundManager";
import {setupSpawns} from "./services/SpawnService";
import {Players} from "@rbxts/services";
import {createStatsIfFirstJoin} from "./services/services_api/PlayerStatsService";
import {startLeaderboardUpdater} from "./services/LearderboardService";


setupSpawns();

Players.PlayerAdded.Connect(createStatsIfFirstJoin);

startLeaderboardUpdater();

const game2 = new RoundManager();
game2.start();
