import { Engine } from "../Engine";
import { Transform } from "../Transform";
import { Vec } from "../Vec";

export class Node {
    parent: Node | null = null;

    layer = 0;

    transform = new Transform(this);

    children: Node[] = [];

    addChild(child: Node) {
        child.parent = this;
        if (!this.children.includes(child)) {
            this.children.push(child);
            child.transform.update();
        }
    }

    removeChild(child: Node) {
        if (this.children.includes(child)) {
            const idx = this.children.indexOf(child);
            child.parent = null;
            this.children = this.children.splice(idx, 1);
            child.transform.update();
        }
    }

    update(engine: Engine) {
        this.transform.update();

        const parallax_mult = new Vec(engine.config.parallax!.x / 10, engine.config.parallax!.y / 10)
            .multScalar(this.layer);
        this.transform.translate(this.transform.getWorldPosition().mult(parallax_mult));

        for (const child of this.children) {
            child.update(engine);
        }
    }

    draw(engine: Engine) {
        for (const child of this.children) {
            child.draw(engine);
        }
    }

    debugDraw(engine:Engine){
        this.transform.debugDraw(engine);
        for (const child of this.children) {
            child.debugDraw(engine);
        }
    }
}