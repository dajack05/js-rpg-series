import { Engine } from "./Engine";
import { Rect, Vec } from "./Vec";

export class Animation {
    frame: number;
    start_frame: number;
    end_frame: number;
    FPS: number;
    last_frame_time: number;

    constructor(
        start_frame: number = 0,
        end_frame: number = 0,
        FPS: number = 1
    ) {
        this.start_frame = start_frame;
        this.end_frame = end_frame;
        this.FPS = FPS;
        this.frame = start_frame;

        this.last_frame_time = 0;
    }

    isStatic(): boolean {
        return this.start_frame == this.end_frame;
    }
}

export class Sprite {
    private image = new Image();
    private isLoaded = false;

    private source = new Rect();
    private subSize = 0;

    private position = new Vec(0, 0);
    private scale = 1.0;
    private animation = new Animation();

    constructor(image_path: string = "") {
        this.image.onload = () => {
            console.log(`Loaded "${this.image.src}"`);
            this.isLoaded = true;

            this.source.size.x = this.subSize > 0 ? this.subSize : this.image.width;
            this.source.size.y = this.subSize > 0 ? this.subSize : this.image.height;
            this.source.origin.x = 0;
            this.source.origin.y = 0;
        }

        if (image_path.length > 0) {
            this.load(image_path);
        }
    }

    load(image_path: string) {
        this.image.src = image_path;
        this.isLoaded = false;
    }

    setSubSize(sub_size: number) {
        this.subSize = sub_size;
    }

    setScale(scale: number) {
        this.scale = scale;
    }

    setPosition(position: Vec) {
        this.position = position;
    }

    getPosition():Vec{
        return this.position;
    }

    translate(translation: Vec) {
        this.position = this.position.add(translation);
    }

    draw(engine: Engine) {
        if (!this.isLoaded) return;
        
        // Update frame if needed
        if (!this.animation.isStatic()) {
            const now = Date.now();
            const ms_since_frame = now - this.animation.last_frame_time;
            const FPS_ms = 1000 / this.animation.FPS;
            if (ms_since_frame > FPS_ms) {
                this.animation.frame++;

                // Bounds
                if (this.animation.frame > this.animation.end_frame) {
                    this.animation.frame = this.animation.start_frame;
                } else if (this.animation.frame < this.animation.start_frame) {
                    this.animation.frame = this.animation.start_frame;
                }

                this.animation.last_frame_time = now;

                // Reevaluate source rect
                const cols = this.image.width / this.subSize;
                this.source.origin.x = this.animation.frame % cols * this.subSize;
                this.source.origin.y = Math.floor(this.animation.frame / cols) * this.subSize;
            }
        }

        engine.drawImage(
            this.image,

            this.source,

            new Rect(this.position, new Vec(this.source.size.x * this.scale, this.source.size.y * this.scale))
        );
    }

    setAnimation(animation: Animation) {
        this.animation = animation;
    }
}