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

    drawImage(image: HTMLImageElement, source_x: number, source_y: number, source_w: number, source_h: number, dest_x: number, dest_y: number, dest_w: number, dest_h: number) {
        this.ctx.drawImage(image, source_x, source_y, source_w, source_h, dest_x, dest_y, dest_w, dest_h);
    }
}