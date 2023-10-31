import { TiledMap } from "./Scene/TiledMap";
import { Vec } from "./Core/Vec";
import { Engine } from "./Core/Engine";
import { Player } from "./Game/Player";
import { EntityRegistry } from "./Core/EntityRegistry";
import { Switch } from "./Game/Switch";
import { Door } from "./Game/Door";
// import testmap from "./assets/maps/testmap.tmj";
import mapData from "./assets/maps/level_01.tmj";

const engine = new Engine("canvas", {
  debug: {
    // collider: true,
  },
});
engine.clearColor = "#2F283A"

EntityRegistry.AddGenerator("switch", Switch.Generate);
EntityRegistry.AddGenerator("door", Door.Generate);

const player = new Player();

const map = new TiledMap({ name: "Map" });
map.scale = new Vec(3, 3);
map.loadTMJ(mapData);
map.colliders.forEach((c) => engine.addCollider(c));

const playerstart = map.getPoint("playerstart");
console.log(playerstart);
if(playerstart){
  player.position = playerstart;
}

engine.root_node.addChild(map);
engine.root_node.addChild(player);

// engine.root_node.debugPrint();
console.log(engine.root_node.getTree());

engine.userUpdate = (engine: Engine) => {
  engine.camera_position = player.position
    .subScalar(window.innerWidth / 2, window.innerHeight / 2)
    .rounded();
};

engine.start();
