import Node from './Scene/Node';
import Sprite from './Scene/Sprite';
import dungeon_sheet from './assets/dungeon_sheet.png';

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const root = new Node("Root");
const tilesetSprite = new Sprite("Tileset Sprite");
tilesetSprite.load(dungeon_sheet);
root.addChild(tilesetSprite);

let t = 0.0;

loop();

function loop() {
    // Update
    t += 0.01;
    tilesetSprite.x = 100 + Math.sin(t) * 100;
    tilesetSprite.y = 100 + Math.cos(t) * 100;
    root.onUpdate();

    // Draw
    ctx.clearRect(0,0,canvas.width,canvas.height);
    root.onDraw(ctx);

    window.requestAnimationFrame(loop);
}
