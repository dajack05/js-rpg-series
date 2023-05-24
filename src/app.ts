import old_hero from "./resources/images/old_hero[16x16].png";

const canvas = document.createElement('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.append(canvas);

let dst_x = window.innerWidth / 2 - 64;
let dst_y = window.innerHeight / 2 - 64;

let is_w_pressed = false;
let is_s_pressed = false;
let is_a_pressed = false;
let is_d_pressed = false;

document.addEventListener('keydown',(evt)=>{
    if(evt.key == 'd'){
        is_d_pressed = true;
    }
    if(evt.key == 'a'){
        is_a_pressed = true;
    }
    if(evt.key == 'w'){
        is_w_pressed = true;
    }
    if(evt.key == 's'){
        is_s_pressed = true;
    }
});

document.addEventListener('keyup',(evt)=>{
    if(evt.key == 'd'){
        is_d_pressed = false;
    }
    if(evt.key == 'a'){
        is_a_pressed = false;
    }
    if(evt.key == 'w'){
        is_w_pressed = false;
    }
    if(evt.key == 's'){
        is_s_pressed = false;
    }
});

const img = new Image();
img.onload = () => loop();
img.src = old_hero;

ctx.imageSmoothingEnabled = false;

function update(){
    if(is_d_pressed) dst_x += 10;
    if(is_a_pressed) dst_x -= 10;
    if(is_w_pressed) dst_y -= 10;
    if(is_s_pressed) dst_y += 10;
}

function draw() {
    ctx.fillStyle = "#cccccc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = 8;

    const src_w = 16;
    const src_h = 16;
    const src_x = 0;
    const src_y = 0;

    const dst_w = src_w * scale;
    const dst_h = src_h * scale;
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

function loop(){
    update();
    draw();

    requestAnimationFrame(()=>loop());
}