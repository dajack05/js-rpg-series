import { Context, Engine } from "../Core/Engine";
import { Vec } from "../Core/Vec";

export type NodeProperties = {
  name?: string;
  position?: {
    x: number;
    y: number;
  };
  scale?: {
    x: number;
    y: number;
  };
  rotation?: number;
};

export default class Node {
  name: string;

  position = new Vec();
  global_position = new Vec();

  a = 0.0;

  scale = new Vec(1, 1);
  global_scale = new Vec(1, 1);

  parent: Node | null = null;
  children: Node[] = [];

  constructor(properties: NodeProperties = {}) {
    this.name = properties.name || "";
    this.a = properties.rotation || 0;

    if (properties.position) {
      this.position = new Vec(properties.position.x, properties.position.y);
    }
    if (properties.scale) {
      this.scale = new Vec(properties.scale.x, properties.scale.y);
    }
  }

  static Generate(properties: unknown): Node {
    return new Node(properties as NodeProperties);
  }

  debugPrint() {
    console.log(this.name, this);
  }

  addChild(child: Node) {
    child.parent = this;
    if (!this.children.includes(child)) {
      this.children.push(child);
    }
  }

  removeChild(child: Node) {
    if (this.children.includes(child)) {
      child.parent = null;
      this.children = this.children.filter((c) => c != child);
    }
  }

  onUpdate(engine: Engine) {
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
    for (const child of this.children) {
      child.onDraw(engine);
    }
  }

  onLateDraw(engine: Engine) {
    for (const child of this.children) {
      child.onLateDraw(engine);
    }
  }
}
