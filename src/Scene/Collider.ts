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

    getOrigin(world_origin = false): Vec {
        if (world_origin) {
            return this.world_position.add(this.world_offset);
        } else {
            return this.position.add(this.offset);
        }
    }

    override update(engine: Engine): void {
        super.update(engine);

        this.world_offset = this.offset.multScalar(this.world_scale).round();
        this.world_size = this.size.multScalar(this.world_scale).round();

        console.log(this.getOrigin(false));
    }

    overlaps(other: Collider): boolean {
        const origin = this.getOrigin(true);
        const otherOrigin = other.getOrigin(true);
        const is_in_x = origin.x < otherOrigin.x + other.world_size.x && origin.x + this.world_size.x > otherOrigin.x;
        const is_in_y = origin.y < otherOrigin.y + other.world_size.y && origin.y + this.world_size.y > otherOrigin.y;
        return is_in_x && is_in_y;
    }

    debugDraw(engine: Engine) {
        engine.strokeRect(new Rect(this.getOrigin(true), this.world_size), this.collidingWith ? "#00FF00" : "#FF0000");
    }
}