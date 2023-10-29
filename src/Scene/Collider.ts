import { Engine } from "../Core/Engine";
import { Vec } from "../Core/Vec";
import Node, { NodeProperties } from "./Node";

export enum ColliderType {
  STATIC,
  DYNAMIC,
  TRIGGER,
}

export type ColliderProperties = NodeProperties & {
  collider_type?: ColliderType;
  extents?: Vec;
  offset?: Vec;
};

export class Collider extends Node {
  private isAddedToWorld = false;

  type: ColliderType;
  extents: Vec;
  offset: Vec;
  collidingWith: Collider | null = null;

  constructor(properties: ColliderProperties) {
    super(properties);
    this.type = properties.collider_type || ColliderType.STATIC;
    this.extents = properties.extents || new Vec(16, 16);
    this.offset = properties.offset || new Vec(0, 0);
  }

  onUpdate(engine: Engine): void {
    if (!this.isAddedToWorld) {
      engine.addCollider(this);
      this.isAddedToWorld = true;
    }
    if (
      this.type == ColliderType.DYNAMIC ||
      this.type == ColliderType.TRIGGER
    ) {
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

  checkCollision(engine: Engine, at?: Vec): void {
    this.collidingWith = null;
    const pos = at || this.global_position.add(this.offset);
    for (const other of engine.colliders) {
      if (other === this) continue;

      const pos2 = other.global_position.add(other.offset);

      const isInX =
        pos.x + this.offset.x - this.extents.x * this.global_scale.x <
          pos2.x + other.extents.x * other.global_scale.x &&
        pos.x + this.offset.x + this.extents.x * this.global_scale.x >
          pos2.x - other.extents.x * other.global_scale.x;

      const isInY =
        pos.y + this.offset.y - this.extents.y * this.global_scale.y <
          pos2.y + other.extents.y * other.global_scale.y &&
        pos.y + this.offset.y + this.extents.y * this.global_scale.y >
          pos2.y - other.extents.y * other.global_scale.y;

      if (isInX && isInY) {
        this.collidingWith = other;
        return;
      }
    }
  }
}
