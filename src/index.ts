import Player from './Game/Player';
import Node from './Scene/Node';
import { TiledMap } from './Scene/TiledMap';
import { Vec } from './Vec';
import testmap from './assets/maps/testmap.tmj';

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.imageSmoothingEnabled = false;

let camera_position = new Vec(0, 0);

const root = new Node("Root");
root.position = new Vec(400, 400);

const player = new Player();

const map = new TiledMap("Map");
map.scale = new Vec(2, 2);
map.loadTMJ(testmap);

root.addChild(map);
root.addChild(player);

let t = 0.0;

loop();

function loop() {
    // Update
    t += 0.01;
    
    root.position = camera_position.multScalar(-1);
    camera_position = player.position
    .subScalar(canvas.width / 2, canvas.height / 2)
    .rounded();

    root.onUpdate(1 / 60);

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    root.onDraw(ctx);

    window.requestAnimationFrame(loop);
}
