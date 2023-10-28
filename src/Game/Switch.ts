import { Engine } from "../Core/Engine";
import { Vec } from "../Core/Vec";
import { Collider, ColliderType } from "../Scene/Collider";
import Node, { NodeProperties } from "../Scene/Node";
import { MakeAnimation, Sprite } from "../Scene/Sprite";
import img from "../assets/images/dungeon_sheet.png";

export class Switch extends Node {
  private collider: Collider;
  private sprite: Sprite;

  state: boolean = false;

  constructor(properties: NodeProperties = {}) {
    super(properties);

    this.collider = new Collider({
      name: `${properties.name}_collider`,
      collider_type: ColliderType.TRIGGER,
      extents: new Vec(8, 8),
      offset: new Vec(0, 0),
    });

    this.sprite = new Sprite({
      name: `${properties.name}_sprite`,
      img_path: img,
      sheet_config: {
        cols: 24,
        rows: 10,
      },
    });

    this.sprite.addAnimation(MakeAnimation("off", 120, 127, false, 1 / 8));
    this.sprite.addAnimation(MakeAnimation("on", 126, 120, false, 1 / 8));
    this.sprite.playAnimation("on");

    this.addChild(this.collider);
    this.addChild(this.sprite);
  }

  onUpdate(engine: Engine): void {
    this.collider.checkCollision(engine);
    if (this.collider.isColliding()) {
      this.state = !this.state;
      console.log(this.state);
    }
    super.onUpdate(engine);
  }
}
