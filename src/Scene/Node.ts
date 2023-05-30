import { Engine } from "../Engine";
import { Vec } from "../Vec";

export class Node {
    parent: Node | null = null;

    position = new Vec(0, 0);
    world_position = new Vec(0, 0);
    scale = 1.0;
    world_scale = 1.0;

    children: Node[] = [];

    addChild(child: Node) {
        child.parent = this;
        if (!this.children.includes(child)) {
            this.children.push(child);
        }
    }

    removeChild(child: Node) {
        if (this.children.includes(child)) {
            const idx = this.children.indexOf(child);
            child.parent = null;
            this.children = this.children.splice(idx, 1);
        }
    }

    update(engine: Engine) {
        // If we have a parent
        if (this.parent !== null) {
            // Update world coords
            this.world_position = this.parent.world_position.add(this.position);
            this.world_scale = this.parent.world_scale * this.scale;
        } else {
            this.world_position = this.position;
            this.world_scale = this.scale;
        }
        for (const child of this.children) {
            child.update(engine);
        }
    }

    draw(engine: Engine) {
        for (const child of this.children) {
            child.draw(engine);
        }
    }

    translate(translation: Vec) {
        this.position = this.position.add(translation);
    }
}