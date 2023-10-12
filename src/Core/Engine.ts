import Node from "../Scene/Node";
import { PhysicsWorld } from "./PhysicsWorld";
import { Vec } from "./Vec";

export type Context = CanvasRenderingContext2D;

export class Engine {
    canvas: HTMLCanvasElement;
    ctx: Context;

    camera_position = new Vec(-window.innerWidth / 2, -window.innerHeight / 2);
    root_node = new Node("Root");

    world = new PhysicsWorld();

    userUpdate = (engine: Engine) => { };
    userDraw = (engine: Engine) => { };

    constructor(canvas_id: string) {
        this.canvas = document.getElementById(canvas_id) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as Context;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.imageSmoothingEnabled = false;

        this.world.debug = true;
    }

    start(): void {
        this.loop();
    }

    getDelta(): number {
        return 1 / 60;
    }

    private loop(): void {

        this.root_node.position = this.camera_position.multScalar(-1);

        this.world.step(this);

        this.root_node.onUpdate(this);
        this.userUpdate(this);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.root_node.onDraw(this);
        this.userDraw(this);

        this.world.draw(this);

        window.requestAnimationFrame(this.loop.bind(this));
    }
}