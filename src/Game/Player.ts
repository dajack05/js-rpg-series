import { Sprite, Animation } from "../Scene/Sprite";
import playerSheet from "../assets/player.png";

enum Anim{
    IDLE = 'idle',
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

        this.playAnimation(Anim.IDLE);
    }
}