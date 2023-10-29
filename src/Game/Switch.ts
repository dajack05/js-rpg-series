import { Broadcast } from "../Core/Broadcast";
import { Engine } from "../Core/Engine";
import { Input } from "../Core/Input";
import { Vec } from "../Core/Vec";
import { Collider, ColliderType } from "../Scene/Collider";
import { Node, NodeProperties } from "../Scene/Node";
import { MakeAnimation, Sprite } from "../Scene/Sprite";
import { TiledObjectData } from "../Scene/TiledMap";
import img from "../assets/images/dungeon_sheet.png";
import use from "../assets/images/use.png";

export const SwitchBroadcastTag = "SWITCH_EVENT";
export type SwitchChangedBroadcastPayload = {
  target_id: string;
  is_on: boolean;
};

export type SwitchProperties = NodeProperties & {
  start_on?: boolean;
};

export class Switch extends Node {
  private collider: Collider;
  private sprite: Sprite;
  private useSprite: Sprite;

  private target_id: string = "";

  isUsable: boolean = false;
  isOn: boolean = false;

  static Generate(objData: TiledObjectData): Node {
    const _switch = new Switch({
      name: `${objData.id}${objData.name}`,
      position: new Vec(
        objData.x + objData.width / 2,
        objData.y - objData.height / 2
      ),
    });

    for (const prop of objData.properties || []) {
      switch (prop.name.toUpperCase()) {
        case "TRIGGERS":
          _switch.target_id = prop.value;
      }
    }
    return _switch;
  }

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
      active: false,
    });

    this.sprite.addAnimation(MakeAnimation("off", 120, 126, false, 1 / 8));
    this.sprite.addAnimation(MakeAnimation("on", 126, 121, false, 1 / 8));
    this.sprite.playAnimation(this.isOn ? "on" : "off", true);

    this.addChild(this.collider);
    this.addChild(this.sprite);
    this.addChild(this.useSprite);
  }

  onReceivedBroadcast(engine: Engine, broadcast: Broadcast): void {
    if (broadcast.tag === SwitchBroadcastTag) {
      const p = broadcast.payload as SwitchChangedBroadcastPayload;
      if (this.name.startsWith(p.target_id)) {
        this.isOn = p.is_on;
        this.stateChanged(engine);
      }
    }
    super.onReceivedBroadcast(engine, broadcast);
  }

  private stateChanged(engine: Engine) {
    this.sprite.playAnimation(this.isOn ? "on" : "off", true);
    if (this.target_id) {
      engine.broadcast({
        tag: SwitchBroadcastTag,
        payload: {
          is_on: this.isOn,
          target_id: this.target_id,
        } as SwitchChangedBroadcastPayload,
      });
    }
  }

  onUpdate(engine: Engine): void {
    this.collider.checkCollision(engine);
    this.isUsable = this.collider.isColliding();

    this.useSprite.active = this.isUsable;

    if (this.isUsable && Input.IsKeyPressed("e")) {
      Input.LockKey("e");
      this.isOn = !this.isOn;
      this.stateChanged(engine);
    }

    super.onUpdate(engine);
  }
}
