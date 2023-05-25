import { Engine } from "./Engine";
import { InputManager } from "./InputManager";
import { Sprite } from "./Sprite";
import old_hero from "./resources/images/old_hero[16x16].png";

const engine = new Engine();

const sprite = new Sprite(old_hero);
sprite.setScale(4);
sprite.setSubSize(16);

sprite.setPosition(window.innerWidth / 2 - 64, window.innerHeight / 2 - 64);

loop();

function update() {
    if (InputManager.IsKeyDown('d')) sprite.translate(10, 0);
    if (InputManager.IsKeyDown('a')) sprite.translate(-10, 0);
    if (InputManager.IsKeyDown('w')) sprite.translate(0, -10);
    if (InputManager.IsKeyDown('s')) sprite.translate(0, 10);
}

function draw() {
    engine.clear();
    sprite.draw(engine);
}

function loop() {
    update();
    draw();

    requestAnimationFrame(() => loop());
}