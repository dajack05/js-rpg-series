import { Engine } from "../Engine";
import { Sprite } from "./Sprite";

import tileset from '../resources/images/ground_tiles.png'
import { Collider } from "./Collider";
import { Rect, Vec } from "../Vec";
import { CollisionWorld } from "../CollisionWorld";

interface TileLayer {
    data: number[],
    parallax_layer: number,
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
    layers: MapLayerStructure[],
}

interface MapLayerStructure {
    id: number,
    name: string,
    type: string,
    visible: boolean,
    properties?: MapProperyStructure[],
}

interface TileLayerJsonStructure extends MapLayerStructure {
    width: number,
    height: number,
    data: number[],
}

interface ObjectLayerJsonStructure extends MapLayerStructure {
    objects: MapObjectJsonStructure[],
}

interface MapProperyStructure {
    name: string,
    type: string,
    value: string,
}

interface MapObjectJsonStructure {
    id: null,
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    type: string,
    properties?: MapProperyStructure[],
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

const LayerTypes = {
    Tile: "tilelayer",
    Object: "objectgroup",
};

export class Map extends Sprite {
    private tilesets: Tileset[] = [];
    private tileLayers: TileLayer[] = [];
    private colliders: Collider[] = [];

    private cullingRect: Rect;

    constructor(tileset_image_path: string, tile_size: number) {
        super(tileset_image_path);
        this.subSize = tile_size;
        this.cullingRect = new Rect(
            new Vec(0, 0),
            new Vec(100, 100)
        );
    }

    addTileLayer(layer: TileLayer) {
        this.tileLayers.push(layer);
    }

    addTileset(tileset: Tileset) {
        tileset.sprite.setSubSize(tileset.tilesize);
        this.tilesets.push(tileset);
    }

    addCollider(collider: Collider) {
        this.addChild(collider);
        this.colliders.push(collider);
    }

    override update(engine: Engine): void {
        super.update(engine);
        const world_size = this.getSubSize() * this.transform.getWorldScale();
        this.cullingRect.origin.x = -world_size;
        this.cullingRect.origin.y = -world_size;
        this.cullingRect.size.x = engine.getCanvasSize().x + world_size;
        this.cullingRect.size.y = engine.getCanvasSize().y + world_size;
    }

    override draw(engine: Engine): void {
        const start = Date.now();
        const old_world_position = this.transform.getWorldPosition();
        for (const layer of this.tileLayers) {
            const parallax_mult = new Vec(engine.config.parallax!.x / 10, engine.config.parallax!.y / 10)
                .multScalar(layer.parallax_layer)
                .mult(this.transform.getWorldPosition());

            for (let y = 0; y < layer.height; y++) {
                for (let x = 0; x < layer.width; x++) {
                    const tile = layer.data[x + y * layer.width];
                    if (tile == 0) continue;

                    // Determine tileset fom tile id
                    const tileset = this.tilesets.find(ts => tile >= ts.firstgid && tile < ts.firstgid + ts.tilecount);
                    if (!tileset) continue; // Unable to find tileset...

                    tileset.sprite.animation.frame = tile - tileset.firstgid;
                    tileset.sprite.transform.setScale(this.transform.getWorldScale());
                    tileset.sprite.calculateSource();
                    const pos = new Vec(
                        Math.floor(old_world_position.x + (x * this.subSize * this.transform.getWorldScale())),
                        Math.floor(old_world_position.y + (y * this.subSize * this.transform.getWorldScale()))
                    )
                        .add(parallax_mult)
                        .round();
                    if (this.cullingRect.isWithin(pos)) {
                        tileset.sprite.transform.setPosition(pos);
                        tileset.sprite.draw(engine);
                    }
                }
            }
        }
        const end = Date.now();
        const diff = end-start;
        console.log(diff);
    }

    override debugDraw(engine: Engine): void {
        super.debugDraw(engine);

        engine.strokeRect(this.cullingRect, "#FF0", 2);
    }

    static FromJson(json: any, world: CollisionWorld | null): Map {
        const map_data = json as MapJsonStructure;
        const map = new Map(tileset, map_data.tilewidth);

        for (const layer_data of map_data.layers) {
            if (!layer_data.visible) continue;

            if (layer_data.type == LayerTypes.Tile) {
                const tile_layer = layer_data as TileLayerJsonStructure;
                let parallax_layer = 0;
                if (tile_layer.properties) {
                    for (const property of tile_layer.properties) {
                        const name = property.name.toLowerCase();
                        if (name === "layer") {
                            parallax_layer = Number.parseFloat(property.value);
                        }
                    }
                }
                map.addTileLayer({
                    data: tile_layer.data,
                    height: tile_layer.height,
                    width: tile_layer.width,
                    parallax_layer: parallax_layer,
                });
            } else if (layer_data.type == LayerTypes.Object) {
                if (world) {
                    const obj_layer = layer_data as ObjectLayerJsonStructure;
                    for (const object of obj_layer.objects) {
                        const collider = new Collider(
                            new Vec(object.x, object.y),
                            new Vec(object.width, object.height)
                        );
                        if (object.properties) {
                            for (const property of object.properties) {
                                const name = property.name.toLowerCase();
                                if (name === "pass") {
                                    const value = property.value.toLowerCase();
                                    collider.passthrough_top = value.includes('top');
                                    collider.passthrough_bottom = value.includes('bottom');
                                    collider.passthrough_left = value.includes('left');
                                    collider.passthrough_right = value.includes('right');
                                }
                            }
                        }

                        world.addCollider(collider);
                        map.addCollider(collider);
                    }
                }
            }
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