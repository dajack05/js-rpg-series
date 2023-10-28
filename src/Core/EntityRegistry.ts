import Node from "../Scene/Node";

export class EntityRegistry {
  private static keys: string[] = [];
  private static generators: (() => Node)[] = [];

  static Add(key: string, generator: () => Node) {
    const _key = key.toUpperCase();
    if (this.keys.includes(_key)) {
      this.generators[this.keys.indexOf(_key)] = generator;
    } else {
      this.keys.push(_key);
      this.generators.push(generator);
    }
  }

  static Get(key: string): Node {
    const _key = key.toUpperCase();
    if (this.keys.includes(_key)) {
      return this.generators[this.keys.indexOf(_key)]();
    } else {
      return new Node({name:"NULL NODE"});
    }
  }
}
