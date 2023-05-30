import { Engine } from "../Engine";
import { Rect, Vec } from "../Vec";
import { Node } from "./Node";

export class Collider extends Node {
    isColliding = false;

    offset: Vec = new Vec(0, 0);
    size: Vec = new Vec(10, 10);

    constructor(offset = new Vec(0, 0), size = new Vec(10, 10)) {
        super();

        this.offset = offset;
        this.size = size;
    }

    getOrigin(): Vec {
        return this.position.add(this.offset);
    }

    overlaps(other: Collider): boolean {
        const origin = this.getOrigin();
        const otherOrigin = other.getOrigin();
        const is_in_x = origin.x < otherOrigin.x + other.size.x && origin.x + this.size.x > otherOrigin.x;
        const is_in_y = origin.y < otherOrigin.y + other.size.y && origin.y + this.size.y > otherOrigin.y;
        return is_in_x && is_in_y;
    }

    override draw(engine: Engine) {
        super.draw(engine);
        engine.strokeRect(new Rect(this.getOrigin(), this.size), this.isColliding ? "#00FF00" : "#FF0000");
    }
}