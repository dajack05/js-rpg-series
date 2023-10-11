import Player from './Game/Player';
import Node from './Scene/Node';
import { Sprite } from './Scene/Sprite';
import { Vec } from './Vec';
import testmap from './assets/images/testmap.png';

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.imageSmoothingEnabled = false;

const root = new Node("Root");
root.position = new Vec(400, 400);

const player = new Player();

const map = new Sprite("Map");
map.scale = new Vec(4, 4);
map.load(testmap);

root.addChild(map);
root.addChild(player);

let t = 0.0;

loop();

function loop() {
    // Update
    t += 0.01;

    root.onUpdate(1 / 60);

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    root.onDraw(ctx);

    window.requestAnimationFrame(loop);
}
