# Episode IX

## Get tileset
[link](https://opengameart.org/content/grafxkids-arcade-platform-assets-new-pallets)

## Map Renderer
- Create Map class extending sprite
- Create Layer interfaces
  - TileLayer
- Add `tileLayers: TileLayer[]`
- Add dummy layer
- Draw all tile layers
- change `animation` and `subSize` from Private to Protected
- Use animation to set whuch "frame" to draw
- Add `Vec::clone()`
- Position and draw
  - `Math.floor(old_world_position.x + (x * this.subSize * this.scale))`
- Skip transparent tiles (0)
- Make sure to update `source`
  - Refactor update code into it's own method
  - Call that method
- Subtract 1 from tile in renderer so we can still reach the first tile

## Setup Tiled
https://www.mapeditor.org/

- Create Tileset [link](https://opengameart.org/content/grafxkids-arcade-platform-assets-new-pallets)
  - 16x16
  - Save into `resources/maps/`

## Make Test Map
- New Map using that tileset
- Tilesize 16x16
- Mapsize 16x16
- Make demo map
- Save as *.json for easy reading
- Embed Tileset
- Create `index.d.ts` with:
```ts
declare module '*.json' {
    const value: string;
    export = value;
}
```

## Map Loader
- Create static `FromJson` method
- Cast json (any) to `MapJsonStructure` for easy access
- return map with default tileset to begin with
- Add each data_layer to map as `TileLayer`
- Remove dummy layer

## Tileset Loader
- Create `TilesetJsonStructure` for easy access
- Install `parcel-reporter-static-files-copy` via `npm install -D parcel-reporter-static-files-copy`
- Create `.parcelrc` with
```json
{
  "extends": ["@parcel/config-default"],
  "reporters":  ["...", "parcel-reporter-static-files-copy"]
}
```
- Now we can load the file by its name
- Get name from `tileset_data.image` by indexing and substring-ing
- Determine which tileset to use based on tile id
  - `const tileset = this.tilesets.find(ts => tile >= ts.firstgid && tile < ts.firstgid + ts.tilecount);`
- `continue` if undefined
- Make sure to set subsize when adding tileset
- Add `Tilesets` as children so they update properly
- Offset the tile after we've deterimined the Tileset so we get the correct IDX