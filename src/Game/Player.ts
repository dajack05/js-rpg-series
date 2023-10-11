import { Input } from "../Input";
import { Sprite, Animation } from "../Scene/Sprite";
import { Vec } from "../Vec";
import playerSheet from "../assets/player.png";

enum Anim {
    IDLE = 'idle',
    DIE = 'die',
    N = 'walk_north',
    S = 'walk_south',
    E = 'walk_east',
    W = 'walk_west',
}

export default class Player extends Sprite {
    constructor() {
        super("Player");
        this.load(playerSheet);
        this.spriteSheet = {
            cols: 9,
            rows: 5,
        };

        this.addAnimation(Anim.IDLE, new Animation(18, 20, 1.5));
        this.addAnimation(Anim.N, new Animation(1, 9, 1 / 10));
        this.addAnimation(Anim.W, new Animation(10, 18, 1 / 10));
        this.addAnimation(Anim.S, new Animation(19, 27, 1 / 10));
        this.addAnimation(Anim.E, new Animation(28, 36, 1 / 10));

        this.addAnimation(Anim.DIE, new Animation(38, 41, 1 / 20, false));

        this.playAnimation(Anim.IDLE);
    }

    override onUpdate(delta: number): void {
        super.onUpdate(delta);

        let moveVec = new Vec();

        this.playAnimation(Anim.IDLE);

        if (Input.IsKeyPressed('w')) {
            this.playAnimation(Anim.N);
            moveVec.y -= 1;
        }
        if (Input.IsKeyPressed('s')) {
            this.playAnimation(Anim.S);
            moveVec.y += 1;
        }
        if (Input.IsKeyPressed('a')) {
            this.playAnimation(Anim.W);
            moveVec.x -= 1;
        }
        if (Input.IsKeyPressed('d')) {
            this.playAnimation(Anim.E);
            moveVec.x += 1;
        }

        this.position = this.position.add(moveVec.multScalar(2,1.5));
    }
}