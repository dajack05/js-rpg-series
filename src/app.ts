const canvas = document.createElement('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.append(canvas);

const img_size = 400;
const img = new Image();
img.src = `https://picsum.photos/${img_size}`;

ctx.fillStyle = "#cccccc";
ctx.fillRect(0, 0, canvas.width, canvas.height);

setInterval(() => {
    const x = -img_size + Math.random() * (canvas.width + img_size * 2);
    const y = -img_size + Math.random() * (canvas.height + img_size * 2);
    const w = Math.random() * img_size;
    const h = Math.random() * img_size;
    ctx.drawImage(img, x, y, w, h);
}, 1);