import {RoundManager} from "./game/RoundManager";
import {setupSpawns} from "./services/SpawnService";
import {Players} from "@rbxts/services";
import {createStatsIfFirstJoin} from "./services/services_api/PlayerStatsService";


setupSpawns();

Players.PlayerAdded.Connect(createStatsIfFirstJoin);

const game2 = new RoundManager();
game2.start();
