import { Collider, CollisionWorld } from "./Collision";
import { Engine } from "./Engine";
import { Player } from "./Player";
import { Vec } from "./Vec";

const engine = new Engine();

const player = new Player(engine);

const collider = new Collider(new Vec(0, 600), new Vec(1500, 50));
engine.collisionWorld.addCollider(collider);

const collider2 = new Collider(new Vec(200, 100), new Vec(50, 500));
engine.collisionWorld.addCollider(collider2);

const collider3 = new Collider(new Vec(700, 100), new Vec(50, 500));
engine.collisionWorld.addCollider(collider3);

loop();

function update() {
    player.update(engine);
    engine.collisionWorld.update();
}

function draw() {
    engine.clear();
    player.draw(engine);
    engine.collisionWorld.draw(engine);
}

function loop() {
    update();
    draw();

    requestAnimationFrame(() => loop());
}