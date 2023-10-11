import Player from './Game/Player';
import Node from './Scene/Node';
import { Vec } from './Vec';

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const root = new Node("Root");
const player = new Player();
player.position = new Vec(400, 400);
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
