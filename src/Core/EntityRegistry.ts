import Node from "../Scene/Node";
import { TiledObjectData } from "../Scene/TiledMap";

export type EntityGeneratorFunction = (
  properties: TiledObjectData
) => Node | null;

export class EntityRegistry {
  private static generators: EntityGeneratorFunction[] = [];

  static AddGenerator(generator: EntityGeneratorFunction) {
    this.generators.push(generator);
  }

  static GetEntity(properties: TiledObjectData): Node {
    let node = new Node();
    for (const gen of this.generators) {
      const n = gen(properties);
      if (n) {
        node = n;
        break;
      }
    }
    return node;
  }
}
