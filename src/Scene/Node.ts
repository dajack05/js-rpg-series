import { Vec } from "../Vec";

export default class Node {
    name: string;

    position = new Vec();
    global_position = new Vec();
    a = 0.0;

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
        this.global_position.x = Math.round((this.parent?.global_position.x || 0) + this.position.x);
        this.global_position.y = Math.round((this.parent?.global_position.y || 0) + this.position.y);

        for (const child of this.children) {
            child.onUpdate(delta);
        }
    }

    onDraw(context: CanvasRenderingContext2D) {
        for (const child of this.children) {
            child.onDraw(context);
        }
    }
}