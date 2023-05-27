import { Engine } from "./Engine";
import { Rect, Vec } from "./Vec";

export class Collider extends Rect {
    isColliding = false;

    overlaps(other: Collider): boolean {
        const is_in_x = other.origin.x < this.origin.x + this.size.x && other.origin.x + other.size.x > this.origin.x;
        const is_in_y = other.origin.y < this.origin.y + this.size.y && other.origin.y + other.size.y > this.origin.y;
        return is_in_x && is_in_y;
    }

    draw(engine: Engine) {
        engine.strokeRect(this, this.isColliding ? "#00FF00" : "#FF0000");
    }

    translate(translation: Vec) {
        this.origin = this.origin.add(translation);
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