import {RoundManager} from "./game/RoundManager";
import {setupSpawns} from "./services/SpawnService";


setupSpawns();

const game2 = new RoundManager();
game2.start();
