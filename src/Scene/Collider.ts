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

    world_offset: Vec = new Vec(0, 0);
    world_size: Vec = new Vec(10, 10);

    passthrough = PassthroughDirection.None;

    constructor(offset = new Vec(0, 0), size = new Vec(10, 10)) {
        super();

        this.offset = offset;
        this.size = size;
    }

    getOrigin(): Vec {
        return this.getPosition().add(this.offset);
    }

    getWorldOrigin(): Vec {
        return this.getWorldPosition().add(this.world_offset);
    }

    override update(engine: Engine): void {
        super.update(engine);

        this.world_offset = this.offset.multScalar(this.getWorldScale()).round();
        this.world_size = this.size.multScalar(this.getWorldScale())
    }

    overlaps(other: Collider): boolean {
        const origin = this.getWorldOrigin();
        const otherOrigin = other.getWorldOrigin();
        const is_in_x = origin.x < otherOrigin.x + other.world_size.x && origin.x + this.world_size.x > otherOrigin.x;
        const is_in_y = origin.y < otherOrigin.y + other.world_size.y && origin.y + this.world_size.y > otherOrigin.y;
        return is_in_x && is_in_y;
    }

    debugDraw(engine: Engine) {
        engine.strokeRect(new Rect(this.getWorldOrigin(), this.world_size), this.collidingWith ? "#00FF00" : "#FF0000");
    }
}