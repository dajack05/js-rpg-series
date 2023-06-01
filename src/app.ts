import { Engine } from "./Engine";
import { Player } from "./Player";
import { Map } from "./Scene/Map";
import { Sound } from "./Scene/Sound";
import { Sprite } from "./Scene/Sprite";
import { Vec } from "./Vec";
import map_01 from './resources/maps/map_01.json'
import bg_music from './resources/sound/Juhani Junkala [Chiptune Adventures] 1. Stage 1.ogg'
import bg_image from './resources/images/background.png';

const engine = new Engine({
    debug: true,
    muteSound: true,
    parallax: {
        x: 1,
        y: 0,
    }
});

engine.root.setScale(4);

const bg = new Sprite(bg_image);
bg.setScale(1);
engine.root.addChild(bg);

const map = Map.FromJson(map_01, engine.collisionWorld);
engine.root.addChild(map);

const player = new Player(engine);
player.setPosition(new Vec(32, 0));
engine.root.addChild(player);

const backgroundMusic = new Sound(bg_music);
backgroundMusic.play();
backgroundMusic.setLooping(true);
backgroundMusic.setPlaybackSpeed(0.9);
engine.root.addChild(backgroundMusic);

function update(engine: Engine) {
    engine.setCameraPosition(player.getPosition());

    const bg_position = engine.getCameraPosition()
        .sub(bg.getWorldImageSize().divScalar(2))
        .add(engine.getCanvasSize().divScalar(2));
    bg.setPosition(bg_position);
}

function draw(engine: Engine) {
}

engine.setUserFunctions(update, draw);