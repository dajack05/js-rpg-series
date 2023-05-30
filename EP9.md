# Episode IX

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
- Create `index.d.ts` with:
```ts
declare module '*.json' {
    const value: string;
    export = value;
}
```

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