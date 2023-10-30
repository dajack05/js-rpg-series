import { Broadcast } from "../Core/Broadcast";
import { Engine } from "../Core/Engine";
import { Vec } from "../Core/Vec";
import { TiledObjectData } from "./TiledMap";

export type NodeProperties = {
  active?: boolean;
  name?: string;
  position?: Vec;
  scale?: Vec;
  rotation?: number;
};

export class Node {
  active: boolean;
  name: string;

  position: Vec;
  global_position = new Vec();

  a = 0.0;

  scale: Vec;
  global_scale = new Vec(1, 1);

  parent: Node | null = null;
  children: Node[] = [];

  static Generate(objData: TiledObjectData): Node {
    return new Node({
      name: `${objData.id}${objData.name}`,
      position: new Vec(objData.x, objData.y),
    });
  }

  constructor(properties: NodeProperties = {}) {
    this.active = properties.active != undefined ? properties.active : true;
    this.name = properties.name || "";
    this.a = properties.rotation || 0;
    this.position = properties.position || new Vec(0, 0);
    this.scale = properties.scale || new Vec(1, 1);
  }

  onReceivedBroadcast(engine: Engine, broadcast: Broadcast): void {
    for (const child of this.children) {
      child.onReceivedBroadcast(engine, broadcast);
    }
  }

  debugPrint(): void {
    console.log(this.name, this);
  }

  getTree(): { [key: string]: any } {
    let tree: { [key: string]: any } = {};
    for (const child of this.children) {
      if(!tree[this.name]){
        tree[this.name] = {};
      }
      tree[this.name][child.name] = child.getTree();
    }
    return tree;
  }

  addChild(child: Node): void {
    child.parent = this;
    if (!this.children.includes(child)) {
      this.children.push(child);
    }
  }

  addChildren(children: Node[]): void {
    for (const child of children) {
      this.addChild(child);
    }
  }

  removeChild(child: Node) {
    if (this.children.includes(child)) {
      child.parent = null;
      this.children = this.children.filter((c) => c != child);
    }
  }

  onUpdate(engine: Engine) {
    if (!this.active) {
      for (const child of this.children) {
        child.active = this.active;
      }
      return;
    }

    this.global_scale = (this.parent?.global_scale || new Vec(1, 1)).mult(
      this.scale
    );
    this.global_position = (this.parent?.global_position || new Vec(0, 0)).add(
      this.position.mult(this.global_scale)
    );

    for (const child of this.children) {
      child.onUpdate(engine);
    }
  }

  onDraw(engine: Engine) {
    if (!this.active) return;

    for (const child of this.children) {
      child.onDraw(engine);
    }
  }

  onLateDraw(engine: Engine) {
    if (!this.active) return;

    for (const child of this.children) {
      child.onLateDraw(engine);
    }
  }
}
