import { Broadcast } from "../Core/Broadcast";
import { Engine } from "../Core/Engine";
import { Input } from "../Core/Input";
import { Vec } from "../Core/Vec";
import { Collider, ColliderType } from "../Scene/Collider";
import { Node, NodeProperties } from "../Scene/Node";
import { MakeAnimation, Sprite } from "../Scene/Sprite";
import { TiledObjectData } from "../Scene/TiledMap";
import dungeonImg from "../assets/images/dungeon_sheet.png";
import useImg from "../assets/images/use.png";
import { SwitchBroadcastTag, SwitchChangedBroadcastPayload } from "./Switch";

export type DoorProperties = NodeProperties & {
  is_useable?: boolean;
  starts_open?: boolean;
};

export class Door extends Node {
  private sprite: Sprite;
  private useSprite: Sprite;
  private collider: Collider;
  private trigger: Collider;

  private isOpen: boolean;
  private canOpen: boolean;

  static Generate(objData: TiledObjectData): Node {
    const node = new Door({
      name: `${objData.id}${objData.name}`,
      position: new Vec(
        objData.x + objData.width / 2,
        objData.y - objData.height / 2
      ),
    });

    for (const prop of objData.properties || []) {
      if (prop.name.toLowerCase() === "is_useable") {
        node.canOpen = prop.value as unknown as boolean;
      } else if (prop.name.toLowerCase() === "starts_open") {
        node.isOpen = prop.value == "true";
      }
    }

    return node;
  }

  constructor(properties: DoorProperties = {}) {
    super(properties);

    this.canOpen =
      properties.is_useable != undefined ? properties.is_useable : true;
    this.isOpen =
      properties.starts_open != undefined ? properties.starts_open : false;

    this.collider = new Collider({
      name: `${properties.name}_collider`,
      collider_type: ColliderType.STATIC,
      extents: new Vec(8, 8),
      offset: new Vec(0, 0),
    });

    this.trigger = new Collider({
      name: `${properties.name}_trigger`,
      collider_type: ColliderType.TRIGGER,
      extents: new Vec(16, 16),
      offset: new Vec(0, 0),
    });

    this.sprite = new Sprite({
      name: `${properties.name}_sprite`,
      img_path: dungeonImg,
      sheet_config: {
        cols: 24,
        rows: 10,
      },
    });
    this.sprite.addAnimation(MakeAnimation("open", 172, 175, false, 1 / 10));
    this.sprite.addAnimation(MakeAnimation("close", 175, 172, false, 1 / 10));

    this.useSprite = new Sprite({
      name: `${properties.name}_use_sprite`,
      img_path: useImg,
      position: new Vec(0, -16),
      active: false,
    });

    this.addChildren([
      this.sprite,
      this.useSprite,
      this.collider,
      this.trigger,
    ]);
    this.onStateChange();
  }

  onUpdate(engine: Engine): void {
    super.onUpdate(engine);

    if (this.canOpen) {
      this.useSprite.active = this.trigger.isColliding();
    }

    if (this.trigger.isColliding() && Input.IsKeyPressed("e")) {
      Input.LockKey("e");
      this.isOpen = !this.isOpen;
      this.onStateChange();
    }
  }

  private onStateChange(): void {
    this.sprite.playAnimation(this.isOpen ? "open" : "close", true);
    this.collider.active = !this.isOpen;
    this.trigger.active = this.canOpen;
  }

  onReceivedBroadcast(engine: Engine, broadcast: Broadcast): void {
    if (broadcast.tag === SwitchBroadcastTag) {
      const payload = broadcast.payload as SwitchChangedBroadcastPayload;
      if (this.name.startsWith(payload.target_id)) {
        this.isOpen = payload.is_on;
        this.onStateChange();
      }
    }
    super.onReceivedBroadcast(engine, broadcast);
  }
}
