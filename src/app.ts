import { Engine } from "./Engine";
import { InputManager } from "./InputManager";
import old_hero from "./resources/images/old_hero[16x16].png";

const engine = new Engine();

let dst_x = window.innerWidth / 2 - 64;
let dst_y = window.innerHeight / 2 - 64;

const img = new Image();
img.onload = () => loop();
img.src = old_hero;


function update() {
    if (InputManager.IsKeyDown('d')) dst_x += 10;
    if (InputManager.IsKeyDown('a')) dst_x -= 10;
    if (InputManager.IsKeyDown('w')) dst_y -= 10;
    if (InputManager.IsKeyDown('s')) dst_y += 10;
}

function draw() {
    engine.clear();

    const scale = 8;

    const src_w = 16;
    const src_h = 16;
    const src_x = 0;
    const src_y = 0;

    const dst_w = src_w * scale;
    const dst_h = src_h * scale;
    engine.drawImage(
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

function loop() {
    update();
    draw();

    requestAnimationFrame(() => loop());
}