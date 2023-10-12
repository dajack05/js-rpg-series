import { Engine } from "../Core/Engine";
import { Vec } from "../Core/Vec";
import Node from "./Node";

export class Collider extends Node {
    private isAddedToWorld = false;

    extents = new Vec(16, 16);
    collidingWith: Collider | null = null;

    onUpdate(engine: Engine): void {
        if (!this.isAddedToWorld) {
            engine.addCollider(this);
            this.isAddedToWorld = true;
        }
        this.checkCollision(engine);
        super.onUpdate(engine);
    }

    isColliding = () => this.collidingWith != null;

    checkCollision(engine:Engine): void {
        this.collidingWith = null;
        for (const other of engine.colliders) {
            if (other === this) continue;

            const isInX =
                this.global_position.x - this.extents.x < other.global_position.x + other.extents.x &&
                this.global_position.x + this.extents.x > other.global_position.x - other.extents.x;

            const isInY =
                this.global_position.y - this.extents.y < other.global_position.y + other.extents.y &&
                this.global_position.y + this.extents.y > other.global_position.y - other.extents.y;

            if (isInX && isInY) {
                this.collidingWith = other;
                return;
            }
        }
    }
}