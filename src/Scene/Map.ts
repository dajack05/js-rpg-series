import { Engine } from "../Engine";
import { Sprite } from "./Sprite";


interface TileLayer {
    data: number[],
    width: number;
    height: number;
}

export class Map extends Sprite {
    private tileLayers: TileLayer[] = [];

    constructor(tileset_image_path: string, tile_size: number) {
        super(tileset_image_path);
        this.subSize = tile_size;
    }

    addTileLayer(layer: TileLayer) {
        this.tileLayers.push(layer);
    }

    override draw(engine: Engine): void {
        const old_world_position = this.world_position.clone();
        for (const layer of this.tileLayers) {
            for (let y = 0; y < layer.height; y++) {
                for (let x = 0; x < layer.width; x++) {
                    const tile = layer.data[x + y * layer.width] - 1;
                    if (tile == -1) continue;
                    this.animation.frame = tile;
                    this.calculateSource();
                    this.world_position.x = Math.floor(old_world_position.x + (x * this.subSize * this.scale));
                    this.world_position.y = Math.floor(old_world_position.y + (y * this.subSize * this.scale));
                    super.draw(engine);
                }
            }
        }
    }
}