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

    const src_w = img.width;
    const src_h = img.height;
    const src_x = 0;
    const src_y = 0;

    const dst_w = img.width * scale;
    const dst_h = img.height * scale;
    const dst_x = window.innerWidth / 2 - dst_w / 2;
    const dst_y = window.innerHeight / 2 - dst_h / 2;
    ctx.drawImage(
        img,
        src_x,
        src_y,
        src_w,
        src_h,
        dst_x,
        dst_y,
        dst_w,
        dst_h
    );
}