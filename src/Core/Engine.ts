import { Collider } from "../Scene/Collider";
import Node from "../Scene/Node";
import { Vec } from "./Vec";

export type Context = CanvasRenderingContext2D;

export type EngineSettings = {
    debug: {
        collider: boolean,
    }
};

export class Engine {
    canvas: HTMLCanvasElement;
    ctx: Context;

    camera_position = new Vec(-window.innerWidth / 2, -window.innerHeight / 2);
    root_node = new Node("Root");

    colliders: Collider[] = [];
    settings: EngineSettings;

    userUpdate = (engine: Engine) => { };
    userDraw = (engine: Engine) => { };

    constructor(canvas_id: string, settings: EngineSettings) {
        this.settings = settings;

        this.canvas = document.getElementById(canvas_id) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as Context;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.imageSmoothingEnabled = false;
    }

    start(): void {
        this.loop();
    }

    getDelta(): number {
        return 1 / 60;
    }

    addCollider(collider: Collider) {
        if(!this.colliders.includes(collider)){
            this.colliders.push(collider);
        }
    }

    removeCollider(collider: Collider) {
        const idx = this.colliders.indexOf(collider);
        if(idx >= 0){
            this.colliders = this.colliders.splice(idx, 1);
        }
    }

    private loop(): void {

        this.root_node.position = this.camera_position.multScalar(-1);

        this.root_node.onUpdate(this);
        this.userUpdate(this);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.root_node.onDraw(this);
        this.userDraw(this);

        this.root_node.onLateDraw(this);

        window.requestAnimationFrame(this.loop.bind(this));
    }
}