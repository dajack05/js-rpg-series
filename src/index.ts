import { TiledMap } from "./Scene/TiledMap";
import { Vec } from "./Core/Vec";
import { Engine } from "./Core/Engine";
import { Player } from "./Game/Player";
import { EntityRegistry } from "./Core/EntityRegistry";
import { Switch } from "./Game/Switch";
import { Door } from "./Game/Door";
import testmap from "./assets/maps/testmap.tmj";

const engine = new Engine("canvas", {
  debug: {
    // collider: true,
  },
});
engine.clearColor = "#2F283A"

EntityRegistry.AddGenerator("switch", Switch.Generate);
EntityRegistry.AddGenerator("door", Door.Generate);

engine.root_node.position = new Vec(400, 400);

const player = new Player();
player.position = new Vec(100, 100);

const map = new TiledMap({ name: "Map" });
map.scale = new Vec(3, 3);
map.loadTMJ(testmap);
map.colliders.forEach((c) => engine.addCollider(c));

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
