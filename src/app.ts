import { Engine } from "./Engine";
import { Player } from "./Player";
import { Map } from "./Scene/Map";
import { Sound } from "./Scene/Sound";
import map_01 from './resources/maps/map_01.json'
import bg_music from './resources/sound/Juhani Junkala [Chiptune Adventures] 1. Stage 1.ogg'

const engine = new Engine({
    muteSound: true
});

const map = Map.FromJson(map_01, engine.collisionWorld);
map.setScale(4);
engine.root.addChild(map);

const player = new Player(engine);
engine.root.addChild(player);

const backgroundMusic = new Sound(bg_music);
backgroundMusic.play();
backgroundMusic.setPlaybackSpeed(0.8);
engine.root.addChild(backgroundMusic);

function update(engine: Engine) {
    engine.setCameraPosition(player.position);
}

function draw(engine: Engine) {
}

engine.setUserFunctions(update, draw);