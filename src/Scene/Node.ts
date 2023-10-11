export default class Node {
    name: string;

    x = 0;
    y = 0;
    gx = 0;
    gy = 0;
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
        this.gx = (this.parent?.gx || 0) + this.x;
        this.gy = (this.parent?.gy || 0) + this.y;

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