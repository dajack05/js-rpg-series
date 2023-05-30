import { Engine } from "./Engine";
import { Player } from "./Player";
import { Map } from "./Scene/Map";
import map_01 from './resources/maps/map_01.json'

const engine = new Engine();

const map = Map.FromJson(map_01, engine.collisionWorld);
map.setScale(4);
engine.root.addChild(map);

const player = new Player(engine);
engine.root.addChild(player);

function update(engine: Engine) {
    engine.setCameraPosition(player.position);
}

function draw(engine: Engine) {
}

engine.setUserFunctions(update, draw);