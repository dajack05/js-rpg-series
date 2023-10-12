import { Input } from "../Core/Input";
import { Collider } from "../Scene/Collider";
import { Sprite, Animation } from "../Scene/Sprite";
import { Vec } from "../Core/Vec";
import playerSheet from "../assets/images/player.png";
import { Engine } from "../Core/Engine";

enum Anim {
    IDLE = 'idle',
    DIE = 'die',
    N = 'walk_north',
    S = 'walk_south',
    E = 'walk_east',
    W = 'walk_west',
}

export class Player extends Collider {

    sprite = new Sprite("Player Sprite");

    constructor() {
        super("Player");
        this.addChild(this.sprite);

        this.sprite.load(playerSheet);
        this.sprite.spriteSheet = {
            cols: 9,
            rows: 5,
        };

        this.sprite.addAnimation(Anim.IDLE, new Animation(18, 20, 1.5));
        this.sprite.addAnimation(Anim.N, new Animation(1, 9, 1 / 10));
        this.sprite.addAnimation(Anim.W, new Animation(10, 18, 1 / 10));
        this.sprite.addAnimation(Anim.S, new Animation(19, 27, 1 / 10));
        this.sprite.addAnimation(Anim.E, new Animation(28, 36, 1 / 10));

        this.sprite.addAnimation(Anim.DIE, new Animation(38, 41, 1 / 20, false));

        this.sprite.playAnimation(Anim.IDLE);
    }

    override onUpdate(engine: Engine): void {

        let moveVec = new Vec();

        this.sprite.playAnimation(Anim.IDLE);

        if (Input.IsKeyPressed('w')) {
            this.sprite.playAnimation(Anim.N);
            moveVec.y -= 1;
        }
        if (Input.IsKeyPressed('s')) {
            this.sprite.playAnimation(Anim.S);
            moveVec.y += 1;
        }

        this.global_position = this.global_position.add(moveVec);
        this.checkCollision(engine);
        if(this.isColliding()){
            this.global_position = this.global_position.sub(moveVec);
            moveVec.y = 0;
        }

        if (Input.IsKeyPressed('a')) {
            this.sprite.playAnimation(Anim.W);
            moveVec.x -= 1;
        }
        if (Input.IsKeyPressed('d')) {
            this.sprite.playAnimation(Anim.E);
            moveVec.x += 1;
        }

        this.global_position = this.global_position.add(moveVec);
        this.checkCollision(engine);
        if(this.isColliding()){
            this.global_position = this.global_position.sub(moveVec);
            moveVec.x = 0;
        }

        this.position = this.position.add(moveVec);
        super.onUpdate(engine);
    }
}