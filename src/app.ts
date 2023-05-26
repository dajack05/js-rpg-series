import { Collider } from "./Collision";
import { Engine } from "./Engine";
import { InputManager } from "./InputManager";
import { Animation, Sprite } from "./Sprite";
import { Vec } from "./Vec";
import old_hero from "./resources/images/old_hero[16x16].png";

const engine = new Engine();

const collider = new Collider(new Vec(20, 20), new Vec(100, 100));

const sprite = new Sprite(old_hero);
sprite.setScale(4);
sprite.setSubSize(16);
const player_collider = new Collider(new Vec(), new Vec(16 * 4, 16 * 4));

const anim_idle = new Animation(0, 3, 1);
const anim_walk_left = new Animation(6, 11, 10);
const anim_walk_right = new Animation(12, 17, 10);
const anim_jump = new Animation(18, 20, 2);
sprite.setAnimation(anim_idle);

sprite.setPosition(new Vec(window.innerWidth / 2 - 64, window.innerHeight / 2 - 64));

loop();

function update() {
    sprite.setAnimation(anim_idle);
    if (InputManager.IsKeyDown('d')) {
        sprite.translate(new Vec(2, 0));
        sprite.setAnimation(anim_walk_right);
    }
    if (InputManager.IsKeyDown('a')) {
        sprite.translate(new Vec(-2, 0));
        sprite.setAnimation(anim_walk_left);
    }
    if (InputManager.IsKeyDown('w')) {
        sprite.translate(new Vec(0, -2));
        sprite.setAnimation(anim_jump);
    }
    if (InputManager.IsKeyDown('s')) {
        sprite.translate(new Vec(0, 2));
    }

    player_collider.origin = sprite.getPosition();
}

function draw() {
    engine.clear();
    sprite.draw(engine);
    collider.draw(engine);
    player_collider.draw(engine);
}

function loop() {
    update();
    draw();

    if(player_collider.overlaps(collider)){
        console.log("Touch!");
    }

    requestAnimationFrame(() => loop());
}