import { Engine } from "../Core/Engine";
import { EntityRegistry } from "../Core/EntityRegistry";
import { Vec } from "../Core/Vec";
import { Collider } from "./Collider";
import Node from "./Node";
import { Animation, MakeAnimation, Sprite } from "./Sprite";

export type TiledObjectData = {
  id: number;
  name: string;
  type: string;
  visible: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
};

type TiledLayerData = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  type: string;
  visible: boolean;
  data?: number[];
  objects?: TiledObjectData[];
};

type TiledTilesetData = {
  columns: number;
  firstgid: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  name: string;
  tilecount: number;
  tileheight: number;
  tilewidth: number;
};

type TiledData = {
  width: number;
  height: number;
  infinite: boolean;
  tileheight: number;
  tilewidth: number;
  layers: TiledLayerData[];
  tilesets: TiledTilesetData[];
};

export class TiledMap extends Node {
  private tilesetSprite = new Sprite();
  private mapData: TiledData | null = null;
  colliders: Collider[] = [];

  loadTMJ(map: string): void {
    this.mapData = JSON.parse(map) as TiledData;
    this.colliders = [];

    if (this.mapData.tilesets.length <= 0) {
      console.error("No tilesets found in map data...", this.mapData);
      return;
    }

    const tileset = this.mapData.tilesets[0];

    this.tilesetSprite = new Sprite({
      name: "tilemap",
      sheet_config: {
        cols: tileset.columns,
        rows: tileset.tilecount / tileset.columns,
      },
      img_path: tileset.image,
    });
    this.tilesetSprite.parent = this;

    this.tilesetSprite.addAnimation(
      MakeAnimation("_", 0, tileset.tilecount, false)
    );
    this.tilesetSprite.playAnimation("_");

    for (const layer of this.mapData.layers) {
      if (!layer.objects) continue;

      for (const object of layer.objects) {
        if (object.type == "") {
          const collider = new Collider({ name: object.name });

          collider.extents = new Vec(object.width, object.height).divScalar(2);
          collider.position = new Vec(object.x, object.y).add(collider.extents);

          this.addChild(collider);
          this.colliders.push(collider);
        } else {
          console.log(`Processing "${object.type}"`);
          const ent = EntityRegistry.GetEntity(object);
          ent.position = new Vec(object.x, object.y);
          ent.name = object.name;
          this.addChild(ent);
        }
      }
    }
  }

  private drawLayer(engine: Engine, layer: TiledLayerData): void {
    if (!this.mapData) return;

    if (!layer.data) return;

    const tileset = this.mapData.tilesets[0];
    for (let y = 0; y < layer.height; y++) {
      for (let x = 0; x < layer.width; x++) {
        this.tilesetSprite.position = new Vec(x, y)
          .multScalar(tileset.tilewidth, tileset.tileheight)
          .addScalar(tileset.tilewidth / 2, tileset.tileheight / 2);
        this.tilesetSprite.onUpdate(engine);
        const tile_id = layer.data[x + y * layer.width];

        if (tile_id == 0) continue;

        this.tilesetSprite.drawFrame(engine.ctx, tile_id - 1);
      }
    }
  }

  onDraw(engine: Engine): void {
    if (this.mapData == null) return;

    for (const layer of this.mapData.layers) {
      if (!layer.name.startsWith("FG")) {
        this.drawLayer(engine, layer);
      }
    }

    super.onDraw(engine);
  }

  onLateDraw(engine: Engine): void {
    if (this.mapData == null) return;

    for (const layer of this.mapData.layers) {
      if (layer.name.startsWith("FG")) {
        this.drawLayer(engine, layer);
      }
    }

    super.onLateDraw(engine);
  }
}
