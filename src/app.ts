import { Engine } from "./Engine";
import { Player } from "./Player";
import { Collider } from "./Scene/Collider";
import { Vec } from "./Vec";

const engine = new Engine();

const player = new Player(engine, new Vec(500, 200));
engine.root.addChild(player);

const collider = new Collider(new Vec(0, 600), new Vec(1500, 50));
engine.collisionWorld.addCollider(collider);

const collider2 = new Collider(new Vec(200, 100), new Vec(50, 500));
engine.collisionWorld.addCollider(collider2);

const collider3 = new Collider(new Vec(700, 100), new Vec(50, 500));
engine.collisionWorld.addCollider(collider3);

const collider4 = new Collider(new Vec(250, 536), new Vec(128, 64));
engine.collisionWorld.addCollider(collider4);

const collider5 = new Collider(new Vec(250, 472), new Vec(64, 64));
engine.collisionWorld.addCollider(collider5);

function update(engine: Engine) {
}

function draw(engine: Engine) {
}

engine.setUserFunctions(update, draw);