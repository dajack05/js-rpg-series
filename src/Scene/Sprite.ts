import { Context, Engine } from "../Core/Engine";
import Node from "./Node";

export class Animation {
    start_frame: number;
    end_frame: number;
    fps: number;
    frame: number;
    counter: number = 0.0;
    loop: boolean;

    constructor(start_frame: number, end_frame: number, fps: number, loop: boolean = true) {
        this.start_frame = start_frame;
        this.end_frame = end_frame;
        this.fps = fps;
        this.frame = start_frame;
        this.loop = loop;
    }
};

export type SpriteSheetConfig = {
    cols: number;
    rows: number;
};

export class Sprite extends Node {
    image = new Image();

    private isReady = false;

    spriteSheet: SpriteSheetConfig = {
        cols: 1,
        rows: 1,
    };

    private animationNames: string[] = [];
    private animations: Animation[] = [];
    private currentAnimation = -1;

    constructor(name?: string) {
        super(name);
        this.image.onload = () => {
            this.isReady = true;
        };
    }

    load(path: string): void {
        this.isReady = false;
        this.image.src = path;
    }

    addAnimation(name: string, animation: Animation): void {
        this.animationNames.push(name);
        this.animations.push(animation);
    }

    playAnimation(name: string): void {
        const i = this.animationNames.indexOf(name);
        this.currentAnimation = i;
    }

    getPlayingAnimation(): { name: string, animation: Animation } | null {
        if (this.currentAnimation >= 0) {
            return {
                name: this.animationNames[this.currentAnimation],
                animation: this.animations[this.currentAnimation],
            }
        }
        return null;
    }

    override onUpdate(engine: Engine): void {
        super.onUpdate(engine);

        if (this.currentAnimation >= 0 && this.animations.length > 0) {
            const anim = this.animations[this.currentAnimation];
            anim.counter += engine.getDelta();
            if (anim.counter > anim.fps) {
                anim.frame++;
                anim.counter = 0.0;
                if (anim.frame >= anim.end_frame) {
                    anim.frame = anim.loop ? anim.start_frame : anim.end_frame;
                }
            }
        }
    }

    drawFrame(context: Context, frame: number) {
        if (this.isReady) {
            const sub_width = this.image.width / this.spriteSheet.cols;
            const sub_height = this.image.height / this.spriteSheet.rows;

            const frame_x = frame % this.spriteSheet.cols;
            const frame_y = Math.floor(frame / this.spriteSheet.cols);

            const x_offset = frame_x * sub_width;
            const y_offset = frame_y * sub_height;

            const draw_width = sub_width * this.global_scale.x;
            const draw_height = sub_width * this.global_scale.y;

            context.drawImage(this.image,
                x_offset, y_offset,
                sub_width, sub_height,
                this.global_position.x - draw_width / 2, this.global_position.y - draw_height / 2,
                draw_width, draw_height);
        }
    }

    override onDraw(engine: Engine): void {
        this.drawFrame(engine.ctx, this.animations[this.currentAnimation]?.frame || 0);
        super.onDraw(engine);
    }
}