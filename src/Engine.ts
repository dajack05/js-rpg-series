import { CollisionWorld } from "./Collision";
import { Node } from "./Scene/Node";
import { Rect } from "./Vec";

export class Engine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private userUpdate = (engine: Engine) => { };
    private userDraw = (engine: Engine) => { };

    root = new Node();
    collisionWorld = new CollisionWorld();

    constructor() {
        this.canvas = document.createElement('canvas') as HTMLCanvasElement;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.ctx.imageSmoothingEnabled = false;

        document.body.append(this.canvas);

        this.loop();
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

    setUserFunctions(userUpdate: (engine: Engine) => void = () => { }, userDraw: (engine: Engine) => void = () => { }) {
        this.userUpdate = userUpdate;
        this.userDraw = userDraw;
    }

    private loop() {
        this.collisionWorld.update();
        this.root.update(this);
        this.userUpdate(this);

        this.clear();
        this.root.draw(this);
        this.userDraw(this);
        this.collisionWorld.draw(this);
        
        requestAnimationFrame(this.loop.bind(this));
    }
}