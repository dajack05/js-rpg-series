import { Engine } from "../Engine";
import { Sprite } from "./Sprite";

import tileset from '../resources/images/ground_tiles.png'

interface TileLayer {
    data: number[],
    width: number;
    height: number;
}

interface Tileset {
    sprite: Sprite,
    firstgid: number,
    tilecount: number,
    tilesize: number,
}

interface MapJsonStructure {
    height: number,
    width: number,

    tileheight: number,
    tilewidth: number,

    tilesets: TilesetJsonStructure[],
    layers: LayerJsonStructure[],
}

interface LayerJsonStructure {
    data: number[],
    height: number,
    id: number,
    name: string,
    type: string,
    visible: boolean,
    width: number,
    x: number,
    y: number,
}

interface TilesetJsonStructure {
    columns: number,
    firstgid: number,
    image: string,
    imageheight: number,
    imagewidth: number,
    name: string,
    tilecount: number,
    tileheight: number,
    tilewidth: number,
}

export class Map extends Sprite {
    private tilesets: Tileset[] = [];
    private tileLayers: TileLayer[] = [];

    constructor(tileset_image_path: string, tile_size: number) {
        super(tileset_image_path);
        this.subSize = tile_size;
    }

    addTileLayer(layer: TileLayer) {
        this.tileLayers.push(layer);
    }

    addTileset(tileset: Tileset) {
        tileset.sprite.setSubSize(tileset.tilesize);
        this.addChild(tileset.sprite);
        this.tilesets.push(tileset);
    }

    override draw(engine: Engine): void {
        const old_world_position = this.world_position.clone();
        for (const layer of this.tileLayers) {
            for (let y = 0; y < layer.height; y++) {
                for (let x = 0; x < layer.width; x++) {
                    const tile = layer.data[x + y * layer.width];
                    if (tile == 0) continue;

                    // Determine tileset fom tile id
                    const tileset = this.tilesets.find(ts => tile >= ts.firstgid && tile < ts.firstgid + ts.tilecount);
                    if (!tileset) continue; // Unable to find tileset...

                    tileset.sprite.animation.frame = tile - tileset.firstgid;
                    tileset.sprite.calculateSource();
                    tileset.sprite.world_position.x = Math.floor(old_world_position.x + (x * this.subSize * this.scale));
                    tileset.sprite.world_position.y = Math.floor(old_world_position.y + (y * this.subSize * this.scale));
                    tileset.sprite.draw(engine);
                }
            }
        }
    }

    static FromJson(json: any): Map {
        const map_data = json as MapJsonStructure;
        const map = new Map(tileset, map_data.tilewidth);

        for (const layer_data of map_data.layers) {
            map.addTileLayer({
                data: layer_data.data,
                height: layer_data.height,
                width: layer_data.width,
            });
        }

        for (const tileset_data of map_data.tilesets) {
            const last_slash = tileset_data.image.lastIndexOf('\/');
            const file_name = tileset_data.image.substring(last_slash + 1);
            map.addTileset({
                firstgid: tileset_data.firstgid,
                sprite: new Sprite(file_name),
                tilecount: tileset_data.tilecount,
                tilesize: tileset_data.tilewidth,
            });
        }

        return map;
    }
}