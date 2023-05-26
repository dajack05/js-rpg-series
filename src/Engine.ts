import { Rect, Vec } from "./Vec";

export class Engine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    constructor() {

        this.canvas = document.createElement('canvas') as HTMLCanvasElement;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.ctx.imageSmoothingEnabled = false;

        document.body.append(this.canvas);
    }

    clear() {
        this.ctx.fillStyle = "#cccccc";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawImage(image: HTMLImageElement, source: Rect, dest: Rect) {
        this.ctx.drawImage(image,
            source.origin.x, source.origin.y, source.size.x, source.size.y,
            dest.origin.x, dest.origin.y, dest.size.x, dest.size.y,
        );
    }

    strokeRect(rect: Rect, color: string) {
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(rect.origin.x, rect.origin.y, rect.size.x, rect.size.y);
    }
}