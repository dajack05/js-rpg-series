import { Engine } from "./Engine";
import { InputManager } from "./InputManager";
import { Collider } from "./Scene/Collider";
import { Sound } from "./Scene/Sound";
import { Animation, Sprite } from "./Scene/Sprite";
import { Vec } from "./Vec";
import old_hero from "./resources/images/old_hero[16x16].png";
import jump_sfx from "./resources/sound/jump.wav";
import walk_sfx from "./resources/sound/walk.wav";

const PlayerAnims = {
    Idle: new Animation(0, 3, 1),
    WalkLeft: new Animation(6, 11, 10),
    WalkRight: new Animation(12, 17, 10),
    Jump: new Animation(18),
};

const Gravity = 10;
const Damping = 0.8;
const MoveSpeed = 10;
const JumpSpeed = 150;

export class Player extends Collider {
    sprite = new Sprite(old_hero);
    jump_sound = new Sound(jump_sfx);
    walk_sound = new Sound(walk_sfx);

    is_grounded = false;

    velocity = new Vec(0, 0);

    constructor(engine: Engine, start_position: Vec = new Vec(0, 0)) {
        super(new Vec(2, 2), new Vec(12, 14));

        this.transform.setPosition(start_position);

        this.sprite.setSubSize(16);
        engine.collisionWorld.addCollider(this);

        this.addChild(this.sprite);
        this.addChild(this.jump_sound);
        this.addChild(this.walk_sound);

        this.walk_sound.setPlaybackSpeed(0.6);
        this.jump_sound.setPlaybackSpeed(2);
    }

    override update(engine: Engine) {
        super.update(engine);

        if (this.transform.getWorldPosition().y > 1000) {
            this.transform.setPosition(new Vec(0, 0));
        } else if (this.transform.getWorldPosition().y < -1000) {
            this.transform.setPosition(new Vec(0, 0));
        }

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
            this.jump_sound.play();
        }

        if (!this.is_grounded) {
            this.sprite.setAnimation(PlayerAnims.Jump);
        }

        this.velocity = this.velocity.add(move_vec.divScalar(10));
        if (Math.abs(this.velocity.x) > 0.2 && this.is_grounded) {
            this.walk_sound.play();
        } else {
            this.walk_sound.stop();
        }

        this.transform.translate(this.velocity.mult(new Vec(0, 1)));
        engine.collisionWorld.checkCollider(this);
        if (this.collidingWith) {
            if (this.collidingWith.passthrough_top && this.velocity.y > 0) {
            } else if (this.collidingWith.passthrough_bottom && this.velocity.y < 0) {
            } else {
                // Player is colliding on the Y axis.
                if (this.velocity.y > 0) {
                    // Player was decending. Must be ground
                    this.is_grounded = true;
                }

                this.transform.translate(this.velocity.mult(new Vec(0, -1)));
                this.velocity.y = 0;
            }
        } else {
            this.is_grounded = false;
        }

        this.transform.translate(this.velocity.mult(new Vec(1, 0)));
        engine.collisionWorld.checkCollider(this);
        if (this.collidingWith) {
            if (this.collidingWith.passthrough_left && this.velocity.x > 0) {
            } else if (this.collidingWith.passthrough_right && this.velocity.x < 0) {
            } else {
                this.transform.translate(this.velocity.mult(new Vec(-1, 0)));
                this.velocity.x = 0;
            }
        }

        this.velocity = this.velocity.mult(new Vec(Damping, 1));
    }
}