import { Vec } from "../Vec";
import Node, { Context } from "./Node";
import { Animation, Sprite } from "./Sprite";

type TiledLayerData = {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    type: string;
    visible: boolean;
    data: number[];
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

    loadTMJ(map: string): void {
        this.mapData = JSON.parse(map) as TiledData;

        if (this.mapData.tilesets.length <= 0) {
            console.error("No tilesets found in map data...", this.mapData);
            return;
        }

        const tileset = this.mapData.tilesets[0];

        this.tilesetSprite = new Sprite("tilemap");
        this.tilesetSprite.parent = this;

        this.tilesetSprite.load(tileset.image);
        this.tilesetSprite.spriteSheet = {
            cols: tileset.columns,
            rows: tileset.tilecount / tileset.columns,
        };
        this.tilesetSprite.addAnimation("_", new Animation(0, tileset.tilecount, 1.0));
        this.tilesetSprite.playAnimation("_");
    }

    private drawLayer(context: Context, layer: TiledLayerData): void {
        if (!this.mapData) return;

        const tileset = this.mapData.tilesets[0];
        for (let y = 0; y < layer.height; y++) {
            for (let x = 0; x < layer.width; x++) {
                this.tilesetSprite.position = new Vec(x, y).multScalar(tileset.tilewidth, tileset.tileheight);
                this.tilesetSprite.onUpdate(1);
                const tile_id = layer.data[x + y * layer.width];

                if (tile_id == 0)
                    continue;

                this.tilesetSprite.drawFrame(context, tile_id - 1);
            }
        }
    }

    onDraw(context: Context): void {
        if (this.mapData == null) return;

        for (const layer of this.mapData.layers) {
            this.drawLayer(context, layer);
        }

        super.onDraw(context);
    }
}