import { Engine } from "./Engine";

export class Rect {
    x = 0.0;
    y = 0.0;
    w = 1.0;
    h = 1.0;
};

export class Sprite {
    private image = new Image();
    private isLoaded = false;

    private source = new Rect();
    private subSize = 0;

    private position_x = 0;
    private position_y = 0;
    private scale = 1.0;

    constructor(image_path: string = "") {
        this.image.onload = () => {
            console.log(`Loaded "${this.image.src}"`);
            this.isLoaded = true;

            this.source.w = this.subSize > 0 ? this.subSize : this.image.width;
            this.source.h = this.subSize > 0 ? this.subSize : this.image.height;
            this.source.x = 0;
            this.source.y = 0;
        }

        if (image_path.length > 0) {
            this.load(image_path);
        }
    }

    load(image_path: string) {
        this.image.src = image_path;
        this.isLoaded = false;
    }

    setSubSize(sub_size:number){
        this.subSize = sub_size;
    }

    setScale(scale: number) {
        this.scale = scale;
    }

    setPosition(x: number, y: number) {
        this.position_x = x;
        this.position_y = y;
    }

    translate(x: number, y: number) {
        this.position_x += x;
        this.position_y += y;
    }

    draw(engine: Engine) {
        engine.drawImage(
            this.image,

            this.source.x, this.source.y,
            this.source.w, this.source.h,

            this.position_x, this.position_y,
            this.source.w * this.scale, this.source.h * this.scale
        );
    }
}