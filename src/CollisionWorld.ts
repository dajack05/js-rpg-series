import { Engine } from "./Engine";
import { Collider } from "./Scene/Collider";

export class CollisionWorld {
    private colliders: Collider[] = [];

    addCollider(collider: Collider) {
        this.colliders.push(collider);
    }

    checkCollider(collider: Collider) {
        collider.collidingWith = null;
        for (const other of this.colliders) {
            if (collider === other) continue;

            if (collider.overlaps(other)) {
                collider.collidingWith = other;
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
            collider.debugDraw(engine);
        }
    }
}