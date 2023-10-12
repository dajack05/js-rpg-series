import { Collider } from "../Scene/Collider";
import { Engine } from "./Engine";

export class PhysicsWorld {
    private colliders: Collider[] = [];
    debug = false;

    addCollider(collider: Collider): void {
        if (!this.colliders.includes(collider)) {
            this.colliders.push(collider);
        }
    }

    removeCollider(collider: Collider): void {
        const idx = this.colliders.indexOf(collider);
        if (idx >= 0) {
            this.colliders = this.colliders.splice(idx, 1);
        }
    }

    step(engine: Engine) {
        for (const c1 of this.colliders) {
            for (const c2 of this.colliders) {
                if (c1 === c2) continue;

                const isInX =
                    c1.global_position.x - c1.extents.x < c2.global_position.x + c2.extents.x &&
                    c1.global_position.x + c1.extents.x > c2.global_position.x - c2.extents.x;

                const isInY =
                    c1.global_position.y - c1.extents.y < c2.global_position.y + c2.extents.y &&
                    c1.global_position.y + c1.extents.y > c2.global_position.y - c2.extents.y;

                c1.isColliding = isInX && isInY;
            }
        }
    }

    draw(engine: Engine) {
        if (!this.debug) return;

        for (const collider of this.colliders) {
            engine.ctx.strokeStyle = collider.isColliding ? "#00FF00" : "#FF0000";
            engine.ctx.strokeRect(
                collider.global_position.x - collider.extents.x, collider.global_position.y - collider.extents.y,
                collider.extents.x * 2, collider.extents.y * 2);
        }
    }
}