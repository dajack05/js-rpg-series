import { Engine } from "./Engine";
import { Node } from "./Scene/Node";
import { Rect, Vec } from "./Vec";

export class Collider extends Node {
    isColliding = false;

    offset: Vec = new Vec(0, 0);
    size: Vec = new Vec(10, 10);

    constructor(offset = new Vec(0, 0), size = new Vec(10, 10)) {
        super();

        this.offset = offset;
        this.size = size;
    }

    getOrigin():Vec{
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

export class CollisionWorld {
    private colliders: Collider[] = [];

    addCollider(collider: Collider) {
        this.colliders.push(collider);
    }

    checkCollider(collider: Collider) {
        collider.isColliding = false;
        for (const other of this.colliders) {
            if (collider === other) continue;

            if (collider.overlaps(other)) {
                collider.isColliding = true;
                other.isColliding = true;
            }
        }
    }

    update() {
        for (const collider of this.colliders) {
            this.checkCollider(collider);
        }
    }

    draw(engine: Engine) {
        for (const collider of this.colliders) {
            collider.draw(engine);
        }
    }
}