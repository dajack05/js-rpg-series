import { Engine } from "../Core/Engine";
import { Input } from "../Core/Input";
import { Vec } from "../Core/Vec";
import { Collider, ColliderType } from "../Scene/Collider";
import Node, { NodeProperties } from "../Scene/Node";
import { MakeAnimation, Sprite } from "../Scene/Sprite";
import img from "../assets/images/dungeon_sheet.png";
import use from "../assets/images/use.png";

export type SwitchProperties = NodeProperties & {
  start_on?: boolean;
};

export class Switch extends Node {
  private collider: Collider;
  private sprite: Sprite;
  private useSprite: Sprite;

  isUsable: boolean = false;
  isOn: boolean = false;

  constructor(properties: SwitchProperties = {}) {
    super(properties);

    this.isOn = properties.start_on != undefined ? properties.start_on : false;

    this.collider = new Collider({
      name: `${properties.name}_collider`,
      collider_type: ColliderType.TRIGGER,
      extents: new Vec(14, 10),
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

    this.useSprite = new Sprite({
      name: `${properties.name}_use_sprite`,
      img_path: use,
      position: new Vec(0, -16),
      show: false,
    });

    this.sprite.addAnimation(MakeAnimation("off", 120, 126, false, 1 / 8));
    this.sprite.addAnimation(MakeAnimation("on", 126, 121, false, 1 / 8));
    this.sprite.playAnimation(this.isOn ? "on" : "off", true);

    this.addChild(this.collider);
    this.addChild(this.sprite);
    this.addChild(this.useSprite);
  }

  onUpdate(engine: Engine): void {
    this.collider.checkCollision(engine);
    this.isUsable = this.collider.isColliding();

    this.useSprite.show = this.isUsable;

    if(this.isUsable && Input.IsKeyPressed('e')){
        Input.LockKey('e');
        this.isOn = !this.isOn;
        this.sprite.playAnimation(this.isOn ? "on" : "off", true);
    }

    super.onUpdate(engine);
  }
}
