import { Engine } from "./Engine";
import { Collider } from "./Scene/Collider";

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