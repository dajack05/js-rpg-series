# Inital Setup

- Create `.gitignore`
  - Set to
    ```
    node_modules/
    dist/
    .parcel-cache/
    ```
- `npm init`
- `npm install --save-dev parcel@latest @parcel/config-default parcel-reporter-static-files-copy typescript`
- Create `src/index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RPG Game</title>
    <style>
        html, body{
            margin: 0;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
        }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script type="module" src="index.ts"></script>
</body>
</html>
```
- Create `src/index.ts`
```ts
import dungeon_sheet from './assets/dungeon_sheet.png';

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

const tileset = new Image();
tileset.onload = ()=>{
    // Do stuff after loading!
    console.log("BAM!");
};
tileset.src = dungeon_sheet;
```
- This will produce red squiggly for import
  - Fix with `index.d.ts` in `assets` folder
```ts
declare module '*.png' {
    const value: string;
    export = value;
}
```
- Update `package.json` with
    ```json
    "source": "src/index.html",
    "scripts": {
        "start":"parcel",
        "build":"parcel build"
    },
    "staticFiles":{
        "staticPath":"src/assets/"
    },
    ```

# Getting starter assets

Tileset: https://opengameart.org/content/a-blocky-dungeon

- Download the tileset
- Create canvas
  - Set it to `width=window.innerWidth` and `height=window.innerHeight`
- Load image
- Draw it onto the screen 1:1

# Create Scenegraph
- Make `Node` class
  - x, y for local position
  - gx, gy for global position
  - a for angle
  - children
    - Add & Remove
    ```ts
    addChild(child: Node) {
        child.parent = this;
        if (!this.children.includes(child)) {
            this.children.push(child);
        }
    }
    
    removeChild(child: Node) {
        if (this.children.includes(child)) {
            child.parent = null;
            this.children = this.children.filter(c => c != child);
        }
    }
    ```
  - parent
  - Update recurse
  - Draw recurse
- Create `Sprite`
  - Has image
  - has private `isReady`
  - constructor sets `onload`
  - `load(path:string):void`
  - `override onDraw(ctx)`
    - if ready, draw!
- Create `Loop()`
  - Test with sin/cos movement
  - Realize you need to clear
  - Clear
- Use global location and inherit from parent

# Making a player

- Download the spritesheets https://opengameart.org/content/lpc-medieval-fantasy-character-sprites
- Get some sprites!!!
- Make a Player which extends Sprite
  - Allow subsection rendering
    ```ts
    export class Animation {
        start_frame: number;
        end_frame: number;
        fps: number;
        frame: number;
        counter: number = 0.0;
        loop: boolean;

        constructor(start_frame: number, end_frame: number, fps: number, loop: boolean = true) {
                this.start_frame = start_frame;
                this.end_frame = end_frame;
                this.fps = fps;
                this.frame = start_frame;
                this.loop = loop;
        }
    };

    export type SpriteSheetConfig = {
        cols: number;
        rows: number;
    };
    ```
- Write an input handler
```ts
export class Input {
    private static didInit = false;
    private static downKeys: Map<string, boolean> = new Map<string, boolean>();
 
    static IsKeyPressed(key: string): boolean {
        if(!Input.didInit){
            Input.Init();
        }
        return Input.downKeys.get(key) || false;
    }
 
    static Init() {
        if(Input.didInit){
            return;
        }

        document.addEventListener('keydown', (e) => this.downKeys.set(e.key, true));
        document.addEventListener('keyup', (e) => this.downKeys.set(e.key, false));
        
        Input.didInit = true;
    }
}
```

# Create vector math class
- Make it!
  - add
  - sub
  - mult
  - div
  - len
  - distanceTo
  - normalized
  - rounded
  - clone
- Use it in `Node`
- Use it to move player

# Map Stuff pt. 1

- Go get tiled https://www.mapeditor.org/
- Make a demo map
  - Export it as an image
  - Load it as a sprite
  - Impliment scaling

# Map Loader

- Save map as .json or .tmj
  - Take a look at it!
- Update `.parcelrc` to
    ```json
    "transformers": {
      "*.{fnt,ogg,mp3,png,wav}": [
        "@parcel/transformer-raw"
      ],
      "*.tmj":["@parcel/transformer-inline-string"]
    }
    ```
- Update `assets/index.d.ts`
    ```ts
    declare module '*.png' {
        const value: string;
        export = value;
    }

    declare module '*.tmj' {
        const value: string;
        export = value;
    }
    ```
- Make a rough approx. of the JSON type in TS
- Parse map for tilemap image (single tilemap for now)
- override onDraw to handle the tilemap stuffs

# Camera

- Create "camera" position
- Set root position to be -camera_position (rounded)

## Refactoring Engine

- Create `Core` folder
  - Move `Input` and `Vec` into `Core/`
  - Create `Core/Engine.ts`
  - Refactor it all! lol
  - Add `userUpdate` and `userDraw`
- Refactor `Node::onUpdate` and `Node::onDraw` to use Engine instead of one-off params

# Physics Nodes

- Create a collision world class
  - Has list of colliders
  - Has debug boolean to toggle drawing
- Crate collider Node class
  - has extents vec
- update and draw world
- auto-add colliders
- Collder needs a `isColliding` tag