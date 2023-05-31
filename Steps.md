# Episode I

## Init node env
`npm init`

## Add TS stuff
`npm install --save-dev typescript @types/node parcel`

## Init TS
`npx tsc init`

## Create .gitignore
```
node_modules/
.parcel-cache/
dist/
```

## Create boilerplate stuff
1. Create `src/`
2. Create `src/index.html`
   - Include `.ts` files in `html` 👍

## Update `package.json` with new scripts
1. Remove `"main": "index.js",`
2. Add `"source":"src/index.html",`
3. Add 
```json
"scripts": {
    "dev":"parcel",
    "build":"parcel build"
},
```

## Simple Proto
1. Create Canvas
2. Attach to body
3. Get context2d
4. fill BG
5. Resize Canvas
6. Fix Styling
7. Fill random boxes

# Episode II

# Loading and rendering an image
- Render an image
    - Create image
    - Set src to `https://picsum.photos/${img_size}`
    - Refactor drawing code to draw image instead

# Loading and rendering OUR image
- Grab an [image](https://opengameart.org/content/classic-hero)
    - Modify it for our use
        - Crop/Transparent
        - Rename to old_hero[16x16].png
        - Store it somewhere like /src/resources/image/XYZ.png
- Get path with require `import old_hero from "./resources/images/old_hero[16x16].png";`
- Create `/src/resources/images/index.d.ts` which includes
```ts
declare module '*.png' {
    const value: any;
    export = value;
}
```
- Add image onLoad function to trigger drawing
- Only draw IF image is loaded
- Refactor drawing code to draw image in middle of screen
- Correct image scaling interpolation `ctx.imageSmoothingEnabled = false;`

## Show a subsection of the image
[Mozilla Ref](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)

- Implement same design while using the src/dst drawImage mode
- Draw frame 1 by using width and height of 16px

## Make game loop
- Make loop function which uses `requestAnimationFrame(`
- Get keyboard input
- Move player
- Clear screen
- Fix stutter (is_w_pressed, ...)
- Add keyup event
- Move update stuff to `update()`

# Episode III

## Refactor input system locally
- Move to `Map<string,boolean>` based input flags
- Simplify keydown and keyup code

## Refactor input system globally
- Create `InputManager` class
- Set keyup and keydown listeners on construct
- Add a `isKeyDown` method
- Refactor main code
- Refactor into static code (only runs one place)

## Refactor engine into its own class
- Create engine source
- Move canvas and ctx into engine

## Refactor Sprite
- Constructor has image_path which can be set
- load loads the image
- has flag for isLoaded
- add draw(engine) method
- add setPosition
- add translate(x,y)
- add SubSize

# Episode III

## Refactor input system locally
- Move to `Map<string,boolean>` based input flags
- Simplify keydown and keyup code

## Refactor input system globally
- Create `InputManager` class
- Set keyup and keydown listeners on construct
- Add a `isKeyDown` method
- Refactor main code
- Refactor into static code (only runs one place)

## Refactor engine into its own class
- Create engine source
- Move canvas and ctx into engine

## Refactor Sprite
- Constructor has image_path which can be set
- load loads the image
- has flag for isLoaded
- add draw(engine) method
- add setPosition
- add translate(x,y)
- add SubSize

# Episode IV

## Animation
- Create Animation class
- Track and increment frame
- Draw selected frame
- Change anim based on input
- Add mirrored frames
```ts
const anim_idle = new Animation(0, 3, 1);
const anim_walk_left = new Animation(6, 11, 10);
const anim_walk_right = new Animation(12, 17, 10);
const anim_jump = new Animation(18, 20, 2);
```

# Episode V

## Math Refactor
- Create Vec class
- Add Sub Mult Div
- Replace `Rect` with two `Vec`s
- Replace `position_x` with `Vec`
- Replace functions asking for `x,y` with `Vec`
- Replace `source` and `dest` with rects in Engine::drawImage
- Move `Rect` to `Vec.ts`
- Constructor for `Rect`

## Collision Detection
- Create a collider class
- Add overlaps method
```ts
    overlaps(other: Collider): boolean {
        const is_in_x = other.origin.x < this.origin.x + this.size.x && other.origin.x + other.size.x > this.origin.x;
        const is_in_y = other.origin.y < this.origin.y + this.size.y && other.origin.y + other.size.y > this.origin.y;
        return is_in_x && is_in_y;
    }
```
- Add draw method
  - Stroke Rect. Add to Engine
- Create simple floor collider
- Create player collider
- Player collider Follows player
- Check if overlapping

# Episode VI

## Simple Single-body Collision Solving
- Check player collision every frame
    - Store movement in vector
    - Move Collider and attach sprite
    - Check Y collision
    - Check X collision

## Multi-body Solving
- Create `CollisionWorld` class
- Add "is colliding" flag to `Collider`
- 2D loop for checking
- Add `CollisionWorld` to app
- Add Gravity!

## Only jump IF we're grounded
- Create grounded variable
- Only jump IF grounded
```ts
if (InputManager.IsKeyDown(' ') && player_is_grounded) {...}
```
- Reset IF we've collided with something and moving downward (+Y)
```ts
player_collider.translate(move_vec.mult(new Vec(0, 1)));
world.checkCollider(player_collider);
if (player_collider.isColliding) {
    // Player is colliding on the Y axis.
    if (move_vec.y > 0) {
        // Player was decending. Must be ground
        player_is_grounded = true;
    }
    player_collider.translate(move_vec.mult(new Vec(0, -1)));
}
```
- Make the jump big enough to matter 😅
- We'll fix the whole velocity thing soon

# Episode VII

## Refactor to Nodes
- Create `Scene/Node.ts` class
  - Class should have add/remove child, update, and draw.
- Migrate player to be a `Node`
  - Make sure to call `super.*`
  - Use `override` for a reminder
  - For now, move gravity into `Player.ts`
- Move `CollisionWorld` into engine so we can access it
  - Move `loop` into the engine
  - Move `world.update` and `world.draw` into `Engine.ts`

## Make `Sprite` a `Node`
- Make `Sprite` extend `Node`
- Remove redundant private vars
- Modify override draw
- `addChild` instead of one-off updates in `Player`

## Make `Collider` a `Node`
- Make `Collider` extend `Node`
- Add constructor to set offset and size
- Make an `offset` variable to allow changed origin
- Make conviencence function to get origin
- update `overlaps`
- Override and update `draw`
- Move `translate` into `Node`
- `Player` needs to get and set position NOT origin
- Trim `Player.collider` to fit `Player.sprite`

## Create Root Node in Engine
- Create `root` node in `Engine`
- Add `player` from `app.ts` to `root`
- Clear `update()` and `draw()` code in `app.ts`

## Tidy
- Move `Collider` to `Scene` folder
- Move `Sprite` to `Scene` folder
- Refacting and red-squigglies lol

# Episode IIX

## Move to velocity based movement
- Use velocity in Player
  - Create the variable
  - Update Velocity instead of collider directly.
  - Update collider based on velocity
    - Divide move_vec
      - Update Vec to allow numbers directly
    - "clip" velocity based on collision
    - Add damping
    - Limit damping to X-Axis

## "Camera" movement
- Demo movement by offsetting root position
  - Create `world_position` system
    - set and unset `child.parent` on `addChild()` and `removeChild()`
    - In `Update()` apply parent's world position and scale
    - Update all nodes to use `world_...` when appropriate
      - Player
        - Attach sprite to collider
        - Make self Collider
  - Translate root in `app.ts`
  - Add world colliders to root so they follow
  - Create helper functions in `Engine` to control camera
    - Make `setCameraPositon` centered
        ```ts
        this.root.position = position.sub(new Vec(this.canvas.width / 2, this.canvas.height / 2)).multScalar(-1);
        ```
- Enable camera smooth movement
  - Add toggle in `Engine`
  - Add camera target
  - Set target in `setCameraPosition`
  - Move to target in `loop`
  - Lerp to target if `smoothCamera == true`
  - Add `smoothSpeed` to shape smoothing

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

# Episode X

## Tiled Collision
- Remove all but floor for testing
- Add object layer with a simple rect
- Rename `LayerJsonStructure` to `TileLayerJsonStructure`
- Create `ObjectLayerJsonStructure`
- Update `MapJsonStructure` to accept `TileLayerJsonStructure | ObjectLayerJsonStructure` as `layers`
- Create `MapObjectJsonStructure` for `ObjectLayerJsonStructure.objects`
- Seperate by type `objectgroup` and `tilelayer`
- For object groups, add them as colliders
- Scale colliders with Map scale
```ts
override setScale(scale: number): void {
    super.setScale(scale);
    for(const collider of this.colliders){
        collider.offset = collider.offset.multScalar(this.scale);
        collider.size = collider.size.multScalar(this.scale);
    }
}
```
- Remove old floor

## One-way blocks
- Add 'oneway' flag and with proper direction to Collider
    - add `MapObjectProperyStructure`
    - Add array of `MapObjectProperyStructure` to `MapObjectJsonStructure`
- Set type to "one-way" in Tiled Class
- Replace `isColliding` with `collidingWith:Collider|null`
- Allow player to continue jumping if collider has "one-way" tag
    - While checking X and Y collision, check if velocity matches with a one-way condition. If so, ignore that collision

## Hide Debug Stuff
- Add a variable to `Engine` called `debug` defaulted to `false`
- Conditionally draw debug stuff
- Refactor `Collider::draw` to `Collider::debugDraw`
- Move config into Interface Engine constructor
- Overlay config with default config

## Loose Ends
- Add visible check to layers

# Episode XI

## Getting Assets
- [Music](https://opengameart.org/content/4-chiptunes-adventure)
- [Jump](https://freesound.org/people/Aesterial-Arts/sounds/633246/)
- [Walk](https://freesound.org/people/Beetlemuse/sounds/529953/)

## Creasting Sound Node
- Create `Sound` class
- add index.d.ts for sound folder
```ts
declare module '*.ogg' {
    const value: string;
    export = value;
}

declare module '*.wav' {
    const value: string;
    export = value;
}
```
- Create demo BG sound
- Create pause overlay
- Add this to .parcelrc
```json
"transformers": {
  "*.{fnt,ogg,mp3,png,wav}": [
    "@parcel/transformer-raw"
  ]
}
```
- Have `Sound` play and pause when game plays and pauses
- Track sound state
- Create `SoundRegistry` to pause/resume all sounds
```ts
window.addEventListener("blur", () => {
    this.paused = true;
    SoundRegistry.Pause();
});
```
- Engine based mute flag (mainly for dev)
  - Track mute state during pause so that any new sounds do not start
  - Add `Resume()` to `SoundRegistry`
  - Check if `SoundRegistry` is paused on update

# Episode XII

## Parallax Map Scrolling
- Add layer number to `Node`
- Take layer number into account when calculating world_position
- Set X and Y parallax speed in Engine
- Set "ignore" flag for collision when loading maps (mainly for dev)

## Refactoring everything to use world_scale
- Map
- Collider setScale
- add round to Vec