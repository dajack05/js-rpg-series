import { Engine } from "./Engine";
import { Player } from "./Player";
import { Collider } from "./Scene/Collider";
import { Map } from "./Scene/Map";
import { Vec } from "./Vec";
import ground_tiles from './resources/images/ground_tiles.png';
import map_01 from './resources/maps/map_01.json'

const engine = new Engine();

// const map = new Map(ground_tiles, 16);
const map = Map.FromJson(map_01);
map.setPosition(new Vec(300,200));
map.setScale(4);
engine.root.addChild(map);

const player = new Player(engine, new Vec(500, 200));
engine.root.addChild(player);

const collider = new Collider(new Vec(0, 600), new Vec(1500, 50));
engine.collisionWorld.addCollider(collider);
engine.root.addChild(collider);

const collider2 = new Collider(new Vec(200, 100), new Vec(50, 500));
engine.collisionWorld.addCollider(collider2);
engine.root.addChild(collider2);

const collider3 = new Collider(new Vec(700, 100), new Vec(50, 500));
engine.collisionWorld.addCollider(collider3);
engine.root.addChild(collider3);

const collider4 = new Collider(new Vec(250, 536), new Vec(128, 64));
engine.collisionWorld.addCollider(collider4);
engine.root.addChild(collider4);

const collider5 = new Collider(new Vec(250, 472), new Vec(64, 64));
engine.collisionWorld.addCollider(collider5);
engine.root.addChild(collider5);

function update(engine: Engine) {
    engine.setCameraPosition(player.position);
}

function draw(engine: Engine) {
}

engine.setUserFunctions(update, draw);