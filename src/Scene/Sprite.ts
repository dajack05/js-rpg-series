import Node from "./Node";

export class Animation {
    start_frame: number;
    end_frame: number;
    fps: number;
    frame: number;
    counter: number = 0.0;

    constructor(start_frame: number, end_frame: number, fps: number) {
        this.start_frame = start_frame;
        this.end_frame = end_frame;
        this.fps = fps;
        this.frame = start_frame;
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

    playAnimation(name:string):void{
        const i = this.animationNames.indexOf(name);
        this.currentAnimation = i;
    }

    override onUpdate(delta: number): void {
        super.onUpdate(delta);

        if (this.currentAnimation >= 0 && this.animations.length > 0) {
            const anim = this.animations[this.currentAnimation];
            anim.counter += delta;
            if (anim.counter > anim.fps) {
                anim.frame++;
                anim.counter = 0.0;
                if (anim.frame >= anim.end_frame) {
                    anim.frame = anim.start_frame;
                }
            }
        }
    }

    override onDraw(context: CanvasRenderingContext2D): void {
        if (this.isReady) {
            const sub_width = this.image.width / this.spriteSheet.cols;
            const sub_height = this.image.height / this.spriteSheet.rows;

            const frame = this.animations[this.currentAnimation]?.frame || 0;
            const frame_x = frame % this.spriteSheet.cols;
            const frame_y = Math.floor(frame / this.spriteSheet.cols);

            const x_offset = frame_x * sub_width;
            const y_offset = frame_y * sub_height;

            console.log(x_offset);

            context.drawImage(this.image,
                x_offset, y_offset,
                sub_width, sub_height,
                this.gx, this.gy,
                sub_width, sub_height);
        }

        super.onDraw(context);
    }
}