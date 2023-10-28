import { Engine } from "../Core/Engine";
import { Vec } from "../Core/Vec";
import Node, { NodeProperties } from "./Node";

export type ColliderProperties = NodeProperties & {
  dynamic?: boolean;
  extents?: Vec;
  offset?: Vec;
};

export class Collider extends Node {
  private isAddedToWorld = false;

  isDynamic: boolean;
  extents = new Vec(16, 16);
  offset = new Vec(0, 0);
  collidingWith: Collider | null = null;

  constructor(properties: ColliderProperties) {
    super(properties);
    this.isDynamic = properties.dynamic || false;
    this.extents = properties.extents || new Vec(16, 16);
    this.offset = properties.offset || new Vec(0, 0);
  }

  onUpdate(engine: Engine): void {
    if (!this.isAddedToWorld) {
      engine.addCollider(this);
      this.isAddedToWorld = true;
    }
    if (this.isDynamic) {
      this.checkCollision(engine);
    }
    super.onUpdate(engine);
  }

  onDraw(engine: Engine): void {
    super.onDraw(engine);

    if (engine.settings.debug.collider) {
      const position = this.global_position.add(this.offset);
      const extents = this.extents.mult(this.global_scale);
      engine.ctx.strokeStyle = this.isColliding() ? "#00FF00" : "#FF0000";
      engine.ctx.strokeRect(
        position.x - extents.x,
        position.y - extents.y,
        extents.x * 2,
        extents.y * 2
      );
    }
  }

  isColliding = () => this.collidingWith != null;

  checkCollision(engine: Engine): void {
    this.collidingWith = null;
    for (const other of engine.colliders) {
      if (other === this) continue;

      const isInX =
        this.global_position.x +
          this.offset.x -
          this.extents.x * this.global_scale.x <
          other.global_position.x + other.extents.x * other.global_scale.x &&
        this.global_position.x +
          this.offset.x +
          this.extents.x * this.global_scale.x >
          other.global_position.x - other.extents.x * other.global_scale.x;

      const isInY =
        this.global_position.y +
          this.offset.y -
          this.extents.y * this.global_scale.y <
          other.global_position.y + other.extents.y * other.global_scale.y &&
        this.global_position.y +
          this.offset.y +
          this.extents.y * this.global_scale.y >
          other.global_position.y - other.extents.y * other.global_scale.y;

      if (isInX && isInY) {
        this.collidingWith = other;
        return;
      }
    }
  }
}
