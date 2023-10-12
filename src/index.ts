import { TiledMap } from './Scene/TiledMap';
import { Vec } from './Core/Vec';
import { Engine } from './Core/Engine';
import testmap from './assets/maps/testmap.tmj';
import { Player } from './Game/Player';
import { Collider } from './Scene/Collider';

const engine = new Engine('canvas', {
    debug: {
        collider: true,
    }
});

engine.root_node.position = new Vec(400, 400);

const player = new Player();

const map = new TiledMap("Map");
map.scale = new Vec(2, 2);
map.loadTMJ(testmap);

engine.root_node.addChild(map);
engine.root_node.addChild(player);

const simpleBox = new Collider();
simpleBox.position = new Vec(200, 200);
simpleBox.extents = new Vec(100, 32);
engine.root_node.addChild(simpleBox);

engine.userUpdate = (engine: Engine) => {
    engine.camera_position = player.position
        .subScalar(window.innerWidth / 2, window.innerHeight / 2)
        .rounded();
}

engine.start();