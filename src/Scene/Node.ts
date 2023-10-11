import { Vec } from "../Vec";

export type Context = CanvasRenderingContext2D;

export default class Node {
    name: string;

    position = new Vec();
    global_position = new Vec();

    a = 0.0;

    scale = new Vec(1, 1);
    global_scale = new Vec(1, 1);

    parent: Node | null = null;
    children: Node[] = [];

    constructor(name: string = "") {
        this.name = name;
    }

    debugPrint() {
        console.log(this.name, this);
    }

    addChild(child: Node) {
        child.parent = this;
        if (!this.children.includes(child)) {
            this.children.push(child);
        }
    }

    removeChild(child: Node) {
        if (this.children.includes(child)) {
            child.parent = null;
            this.children = this.children.filter(c => c != child);
        }
    }

    onUpdate(delta: number) {
        this.global_scale = (this.parent?.global_scale || new Vec(1, 1)).mult(this.scale);
        this.global_position = (this.parent?.global_position || new Vec(0, 0)).add(this.position.mult(this.global_scale));

        for (const child of this.children) {
            child.onUpdate(delta);
        }
    }

    onDraw(context: Context) {
        for (const child of this.children) {
            child.onDraw(context);
        }
    }
}