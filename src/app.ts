import old_hero from "./resources/images/old_hero[16x16].png";

const canvas = document.createElement('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.append(canvas);

const img_size = 400;
const img = new Image();
img.onload = () => draw();
img.src = old_hero;

ctx.imageSmoothingEnabled = false;

ctx.fillStyle = "#cccccc";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function draw() {
    const scale = 8;
    const w = img.width * scale;
    const h = img.height * scale;
    const x = window.innerWidth / 2 - w / 2;
    const y = window.innerHeight / 2 - h / 2;
    ctx.drawImage(img, x, y, w, h);
}