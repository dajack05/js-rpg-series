import { Engine } from "../Engine";
import { Node } from "./Node";
import { Rect, Vec } from "../Vec";

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

export class Sprite extends Node {
    private image = new Image();
    private isLoaded = false;

    private source = new Rect();
    protected subSize = 0;
    animation = new Animation();

    constructor(image_path: string = "") {
        super();

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

    calculateSource() {
        const cols = this.image.width / this.subSize;
        this.source.origin.x = this.animation.frame % cols * this.subSize;
        this.source.origin.y = Math.floor(this.animation.frame / cols) * this.subSize;
    }

    getImageSize(): Vec {
        return new Vec(this.image.width, this.image.height);
    }

    getWorldImageSize(): Vec {
        return new Vec(this.image.width, this.image.height).multScalar(this.transform.getWorldScale());
    }

    override draw(engine: Engine) {
        super.draw(engine);

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

                this.calculateSource();
            }
        }

        engine.drawImage(
            this.image,

            this.source,

            new Rect(this.transform.getWorldPosition(), new Vec(this.source.size.x * this.transform.getWorldScale(), this.source.size.y * this.transform.getWorldScale()))
        );
    }

    setAnimation(animation: Animation) {
        this.animation = animation;
    }
}