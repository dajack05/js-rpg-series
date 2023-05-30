import { Engine } from "./Engine";
import { Player } from "./Player";
import { Collider } from "./Scene/Collider";
import { Map } from "./Scene/Map";
import { Vec } from "./Vec";
import map_01 from './resources/maps/map_01.json'

const engine = new Engine();

// const map = new Map(ground_tiles, 16);
const map = Map.FromJson(map_01, engine.collisionWorld);
map.setScale(4);
engine.root.addChild(map);

const player = new Player(engine, new Vec(500, 200));
engine.root.addChild(player);

const collider = new Collider(new Vec(0, 600), new Vec(1500, 50));
engine.collisionWorld.addCollider(collider);
engine.root.addChild(collider);

function update(engine: Engine) {
    engine.setCameraPosition(player.position);
}

function draw(engine: Engine) {
}

engine.setUserFunctions(update, draw);