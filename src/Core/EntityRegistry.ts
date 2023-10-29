import Node from "../Scene/Node";
import { TiledObjectData } from "../Scene/TiledMap";

export type EntityGeneratorFunction = (
  properties: TiledObjectData
) => Node | null;

export class EntityRegistry {
  private static generators: Map<string, EntityGeneratorFunction> = new Map<
    string,
    EntityGeneratorFunction
  >();

  static AddGenerator(key: string, generator: EntityGeneratorFunction) {
    this.generators.set(key, generator);
  }

  static GetEntity(properties: TiledObjectData): Node {
    const generator = this.generators.get(properties.type);
    if (generator != undefined) {
      return generator(properties) || new Node();
    }
    return new Node();
  }
}
