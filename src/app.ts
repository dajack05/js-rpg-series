import { Engine } from "./Engine";
import { Player } from "./Player";
import { Map } from "./Scene/Map";
import { Sound } from "./Scene/Sound";
import { Vec } from "./Vec";
import map_01 from './resources/maps/map_01.json'
import bg_music from './resources/sound/Juhani Junkala [Chiptune Adventures] 1. Stage 1.ogg'

const engine = new Engine({
    // debug: true,
    // muteSound: false,
    parallax: {
        x: 1,
        y: 0,
    }
});

engine.root.setScale(4);

const map = Map.FromJson(map_01, engine.collisionWorld);
engine.root.addChild(map);

const player = new Player(engine);
player.setPosition(new Vec(1000,200));
engine.root.addChild(player);

const backgroundMusic = new Sound(bg_music);
backgroundMusic.play();
backgroundMusic.setLooping(true);
backgroundMusic.setPlaybackSpeed(0.9);
engine.root.addChild(backgroundMusic);

function update(engine: Engine) {
    engine.setCameraPosition(player.getPosition());
}

function draw(engine: Engine) {
}

engine.setUserFunctions(update, draw);