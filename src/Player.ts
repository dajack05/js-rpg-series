import { Engine } from "./Engine";
import { InputManager } from "./InputManager";
import { Collider } from "./Scene/Collider";
import { Node } from "./Scene/Node";
import { Animation, Sprite } from "./Scene/Sprite";
import { Vec } from "./Vec";
import old_hero from "./resources/images/old_hero[16x16].png";

const PlayerAnims = {
    Idle: new Animation(0, 3, 1),
    WalkLeft: new Animation(6, 11, 10),
    WalkRight: new Animation(12, 17, 10),
    Jump: new Animation(18, 20, 2),
};

export class Player extends Node {
    collider = new Collider(new Vec(8, 0), new Vec(48, 64));
    sprite = new Sprite(old_hero);

    is_grounded = false;

    gravity = 2;

    constructor(engine: Engine, start_position: Vec = new Vec(0, 0)) {
        super();

        this.position = start_position;
        this.collider.position = this.position;

        this.sprite.setScale(4);
        this.sprite.setSubSize(16);
        engine.collisionWorld.addCollider(this.collider);

        this.addChild(this.sprite);
    }

    override update(engine: Engine) {
        super.update(engine);

        this.sprite.setAnimation(PlayerAnims.Idle);

        let move_vec = new Vec(0, this.gravity);

        if (InputManager.IsKeyDown('d')) {
            move_vec = move_vec.add(new Vec(2, 0))
            this.sprite.setAnimation(PlayerAnims.WalkRight);
        }
        if (InputManager.IsKeyDown('a')) {
            move_vec = move_vec.add(new Vec(-2, 0))
            this.sprite.setAnimation(PlayerAnims.WalkLeft);
        }
        if (InputManager.IsKeyDown(' ') && this.is_grounded) {
            this.is_grounded = false;
            move_vec = move_vec.add(new Vec(0, -80))
            this.sprite.setAnimation(PlayerAnims.Jump);
        }

        this.collider.translate(move_vec.mult(new Vec(0, 1)));
        engine.collisionWorld.checkCollider(this.collider);
        if (this.collider.isColliding) {
            // Player is colliding on the Y axis.
            if (move_vec.y > 0) {
                // Player was decending. Must be ground
                this.is_grounded = true;
            }
            this.collider.translate(move_vec.mult(new Vec(0, -1)));
        }

        this.collider.translate(move_vec.mult(new Vec(1, 0)));
        engine.collisionWorld.checkCollider(this.collider);
        if (this.collider.isColliding) {
            this.collider.translate(move_vec.mult(new Vec(-1, 0)));
        }

        this.sprite.setPosition(this.collider.position);
    }

    override draw(engine: Engine): void {
        super.draw(engine);
    }
}