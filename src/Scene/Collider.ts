import { Engine } from "../Engine";
import { Rect, Vec } from "../Vec";
import { Node } from "./Node";

export enum PassthroughDirection {
    FromBottom,
    FromTop,
    FromLeft,
    FromRight,
    None,
}

export class Collider extends Node {
    collidingWith: Collider | null = null;

    offset: Vec = new Vec(0, 0);
    size: Vec = new Vec(10, 10);

    passthrough = PassthroughDirection.None;

    constructor(offset = new Vec(0, 0), size = new Vec(10, 10)) {
        super();

        this.offset = offset;
        this.size = size;
    }

    getOrigin(world_origin = false): Vec {
        if (world_origin) {
            return this.world_position.add(this.offset);
        } else {
            return this.position.add(this.offset);
        }
    }

    overlaps(other: Collider): boolean {
        const origin = this.getOrigin(false);
        const otherOrigin = other.getOrigin(false);
        const is_in_x = origin.x < otherOrigin.x + other.size.x && origin.x + this.size.x > otherOrigin.x;
        const is_in_y = origin.y < otherOrigin.y + other.size.y && origin.y + this.size.y > otherOrigin.y;
        return is_in_x && is_in_y;
    }

    override draw(engine: Engine) {
        super.draw(engine);
        engine.strokeRect(new Rect(this.getOrigin(true), this.size), this.collidingWith ? "#00FF00" : "#FF0000");
    }
}