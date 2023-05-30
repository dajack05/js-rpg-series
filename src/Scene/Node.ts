import { Engine } from "../Engine";
import { Vec } from "../Vec";

export class Node {
    position = new Vec(0, 0);
    scale = 1.0;
    parent: Node | null = null;
    children: Node[] = [];

    addChild(child: Node) {
        if (!this.children.includes(child)) {
            this.children.push(child);
        }
    }

    removeChild(child: Node) {
        if (this.children.includes(child)) {
            const idx = this.children.indexOf(child);
            this.children = this.children.splice(idx, 1);
        }
    }

    update(engine: Engine) {
        for (const child of this.children) {
            child.update(engine);
        }
    }

    draw(engine: Engine) {
        for (const child of this.children) {
            child.draw(engine);
        }
    }
}