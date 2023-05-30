import { Collider, CollisionWorld } from "./Collision";
import { Engine } from "./Engine";
import { InputManager } from "./InputManager";
import { Animation, Sprite } from "./Sprite";
import { Vec } from "./Vec";
import old_hero from "./resources/images/old_hero[16x16].png";

const engine = new Engine();

const world = new CollisionWorld();

const collider = new Collider(new Vec(0, 600), new Vec(1500, 50));
world.addCollider(collider);

const collider2 = new Collider(new Vec(200, 100), new Vec(50, 500));
world.addCollider(collider2);

const collider3 = new Collider(new Vec(700, 100), new Vec(50, 500));
world.addCollider(collider3);

const sprite = new Sprite(old_hero);
sprite.setScale(4);
sprite.setSubSize(16);
const player_collider = new Collider(new Vec(500, 500), new Vec(16 * 4, 16 * 4));
let player_is_grounded = false;
world.addCollider(player_collider);

const anim_idle = new Animation(0, 3, 1);
const anim_walk_left = new Animation(6, 11, 10);
const anim_walk_right = new Animation(12, 17, 10);
const anim_jump = new Animation(18, 20, 2);
sprite.setAnimation(anim_idle);

const gravity = 2;

loop();

function update() {
    sprite.setAnimation(anim_idle);

    let move_vec = new Vec(0, gravity);

    if (InputManager.IsKeyDown('d')) {
        move_vec = move_vec.add(new Vec(2, 0))
        sprite.setAnimation(anim_walk_right);
    }
    if (InputManager.IsKeyDown('a')) {
        move_vec = move_vec.add(new Vec(-2, 0))
        sprite.setAnimation(anim_walk_left);
    }
    if (InputManager.IsKeyDown(' ') && player_is_grounded) {
        player_is_grounded = false;
        move_vec = move_vec.add(new Vec(0, -4))
        sprite.setAnimation(anim_jump);
    }

    player_collider.translate(move_vec.mult(new Vec(0, 1)));
    world.checkCollider(player_collider);
    if (player_collider.isColliding) {
        // Player is colliding on the Y axis.
        if (move_vec.y > 0) {
            // Player was decending. Must be ground
            player_is_grounded = true;
        }
        player_collider.translate(move_vec.mult(new Vec(0, -1)));
    }

    player_collider.translate(move_vec.mult(new Vec(1, 0)));
    world.checkCollider(player_collider);
    if (player_collider.isColliding) {
        player_collider.translate(move_vec.mult(new Vec(-1, 0)));
    }

    sprite.setPosition(player_collider.origin);
    world.update();
}

function draw() {
    engine.clear();
    sprite.draw(engine);
    world.draw(engine);
}

function loop() {
    update();
    draw();

    requestAnimationFrame(() => loop());
}