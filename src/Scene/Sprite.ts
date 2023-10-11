import Node from "./Node";

export default class Sprite extends Node {
    image = new Image();
    
    private isReady = false;

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

    override onDraw(context: CanvasRenderingContext2D): void {
        if (this.isReady) {
            context.drawImage(this.image, this.x, this.y);
        }
        super.onDraw(context);
    }
}