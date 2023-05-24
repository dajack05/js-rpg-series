const canvas = document.createElement('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.append(canvas);

ctx.fillStyle = "#cccccc";
ctx.fillRect(0, 0, 1000, 1000);

setInterval(() => {
    ctx.fillStyle = `hsl(${Math.round(Math.random() * 360)}deg, 100%, 50%)`;
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 100, Math.random() * 100);
}, 1);