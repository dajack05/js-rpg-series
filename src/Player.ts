import { Engine } from "./Engine";
import { InputManager } from "./InputManager";
import { Collider } from "./Scene/Collider";
import { Animation, Sprite } from "./Scene/Sprite";
import { Vec } from "./Vec";
import old_hero from "./resources/images/old_hero[16x16].png";

const PlayerAnims = {
    Idle: new Animation(0, 3, 1),
    WalkLeft: new Animation(6, 11, 10),
    WalkRight: new Animation(12, 17, 10),
    Jump: new Animation(18, 20, 2),
};

const Gravity = 10;
const Damping = 0.8;
const MoveSpeed = 10;
const JumpSpeed = 150;

export class Player extends Collider {
    sprite = new Sprite(old_hero);

    is_grounded = false;

    velocity = new Vec(0, 0);

    constructor(engine: Engine, start_position: Vec = new Vec(0, 0)) {
        super(new Vec(8, 0), new Vec(48, 64));

        this.position = start_position;

        this.sprite.setScale(4);
        this.sprite.setSubSize(16);
        engine.collisionWorld.addCollider(this);

        this.addChild(this.sprite);
    }

    override update(engine: Engine) {
        super.update(engine);

        this.sprite.setAnimation(PlayerAnims.Idle);

        let move_vec = new Vec(0, Gravity);

        if (InputManager.IsKeyDown('d')) {
            move_vec = move_vec.add(new Vec(MoveSpeed, 0))
            this.sprite.setAnimation(PlayerAnims.WalkRight);
        }
        if (InputManager.IsKeyDown('a')) {
            move_vec = move_vec.add(new Vec(-MoveSpeed, 0))
            this.sprite.setAnimation(PlayerAnims.WalkLeft);
        }
        if (InputManager.IsKeyDown(' ') && this.is_grounded) {
            this.is_grounded = false;
            move_vec = move_vec.add(new Vec(0, -JumpSpeed))
            this.sprite.setAnimation(PlayerAnims.Jump);
        }

        this.velocity = this.velocity.add(move_vec.divScalar(10));

        this.translate(this.velocity.mult(new Vec(0, 1)));
        engine.collisionWorld.checkCollider(this);
        if (this.isColliding) {
            // Player is colliding on the Y axis.
            if (this.velocity.y > 0) {
                // Player was decending. Must be ground
                this.is_grounded = true;
            }
            this.translate(this.velocity.mult(new Vec(0, -1)));
            this.velocity.y = 0;
        }

        this.translate(this.velocity.mult(new Vec(1, 0)));
        engine.collisionWorld.checkCollider(this);
        if (this.isColliding) {
            this.translate(this.velocity.mult(new Vec(-1, 0)));
            this.velocity.x = 0;
        }

        this.velocity = this.velocity.mult(new Vec(Damping, 1));
    }

    override draw(engine: Engine): void {
        super.draw(engine);
    }
}