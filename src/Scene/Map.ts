import { Engine } from "../Engine";
import { Sprite } from "./Sprite";

import tileset from '../resources/images/ground_tiles.png'
import { Collider, PassthroughDirection } from "./Collider";
import { Vec } from "../Vec";
import { CollisionWorld } from "../CollisionWorld";

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
    layers: (TileLayerJsonStructure | ObjectLayerJsonStructure)[],
}

interface TileLayerJsonStructure {
    id: number,
    width: number,
    height: number,
    name: string,
    type: string,
    data: number[],
    visible: boolean,
}

interface MapObjectProperyStructure {
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
    properties?: MapObjectProperyStructure[],
}

interface ObjectLayerJsonStructure {
    id: number,
    name: string,
    objects: MapObjectJsonStructure[],
    visible: boolean,
    type: string,
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

    constructor(tileset_image_path: string, tile_size: number) {
        super(tileset_image_path);
        this.subSize = tile_size;
    }

    override setScale(scale: number): void {
        super.setScale(scale);
        for (const collider of this.colliders) {
            collider.offset = collider.offset.multScalar(this.scale);
            collider.size = collider.size.multScalar(this.scale);
        }
    }

    addTileLayer(layer: TileLayer) {
        this.tileLayers.push(layer);
    }

    addTileset(tileset: Tileset) {
        tileset.sprite.setSubSize(tileset.tilesize);
        this.addChild(tileset.sprite);
        this.tilesets.push(tileset);
    }

    addCollider(collider: Collider) {
        this.addChild(collider);
        this.colliders.push(collider);
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

    static FromJson(json: any, world: CollisionWorld): Map {
        const map_data = json as MapJsonStructure;
        const map = new Map(tileset, map_data.tilewidth);

        for (let layer_data of map_data.layers) {
            if (layer_data.type == LayerTypes.Tile) {
                layer_data = layer_data as TileLayerJsonStructure;
                map.addTileLayer({
                    data: layer_data.data,
                    height: layer_data.height,
                    width: layer_data.width,
                });
            } else if (layer_data.type == LayerTypes.Object) {
                layer_data = layer_data as ObjectLayerJsonStructure;
                for (const object of layer_data.objects) {
                    const collider = new Collider(
                        new Vec(object.x, object.y),
                        new Vec(object.width, object.height)
                    );
                    if(object.properties){
                        for(const property of object.properties){
                            if(property.name.toLowerCase() === "pass"){
                                const value = property.value.toLowerCase();
                                if(value.includes('top')){
                                    collider.passthrough = PassthroughDirection.FromTop;
                                }
                                if(value.includes('bottom')){
                                    collider.passthrough = PassthroughDirection.FromBottom
                                }
                                if(value.includes('left')){
                                    collider.passthrough = PassthroughDirection.FromLeft;
                                }
                                if(value.includes('right')){
                                    collider.passthrough = PassthroughDirection.FromRight;
                                }
                            }
                        }
                    }
                    world.addCollider(collider);
                    map.addCollider(collider);
                    console.log(collider);
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