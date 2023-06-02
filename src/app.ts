import { Engine } from "./Engine";
import { Player } from "./Player";
import { Map } from "./Scene/Map";
import { Sound } from "./Scene/Sound";
import { Sprite } from "./Scene/Sprite";
import { Vec } from "./Vec";
import map_01 from './resources/maps/map_01.json'
import stresstest from './resources/maps/stres_test.json'
import bg_music from './resources/sound/Juhani Junkala [Chiptune Adventures] 1. Stage 1.ogg'
import bg_image from './resources/images/background.png';
import { MobileControls } from "./MobileControls";

const engine = new Engine({
    debug: true,
    muteSound: true,
    parallax: {
        x: 1,
        y: 0,
    }
});

engine.root.transform.setScale(4);

const controls = new MobileControls(engine.getCanvasSize());

const bg = new Sprite(bg_image);
bg.transform.setScale(1);
engine.root.addChild(bg);

const map = Map.FromJson(map_01, engine.collisionWorld);
engine.root.addChild(map);

const player = new Player(engine);
player.transform.setPosition(new Vec(32, 0));
engine.root.addChild(player);

const backgroundMusic = new Sound(bg_music);
backgroundMusic.play();
backgroundMusic.setLooping(true);
backgroundMusic.setPlaybackSpeed(0.9);
engine.root.addChild(backgroundMusic);

function update(engine: Engine) {
    engine.setCameraPosition(player.transform.getPosition());

    const bg_position = engine.getCameraPosition()
        .sub(bg.getWorldImageSize().divScalar(2))
        .add(engine.getCanvasSize().divScalar(2));
    bg.transform.setPosition(bg_position);

    if (engine.isMobile()) {
        controls.update(engine);
    }
}

function draw(engine: Engine) {
    if (engine.isMobile()) {
        controls.draw(engine);
    }
}

engine.setUserFunctions(update, draw);