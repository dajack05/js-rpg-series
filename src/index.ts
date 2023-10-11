import Node from './Scene/Node';
import Sprite from './Scene/Sprite';
import dungeon_sheet from './assets/dungeon_sheet.png';

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const root = new Node("Root");
const childCount = 20;
const tilesetSprites:Sprite[] = [];

for (let i = 0; i < childCount; i++) {
    tilesetSprites.push(new Sprite(`Tileset Sprite ${i + 1}`));
    tilesetSprites[i].load(dungeon_sheet);
    if (i == 0) {
        root.addChild(tilesetSprites[i]);
    } else {
        tilesetSprites[i - 1].addChild(tilesetSprites[i]);
    }
}

root.x = 400;
root.y = 400;

let t = 0.0;

root.debugPrint();

loop();

function loop() {
    // Update
    t += 0.01;

    for (const tilesetSprite of tilesetSprites) {
        tilesetSprite.x = Math.sin(t) * 20;
        tilesetSprite.y = Math.cos(t) * 20;
    }

    root.onUpdate();

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    root.onDraw(ctx);

    window.requestAnimationFrame(loop);
}
