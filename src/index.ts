import { TiledMap } from "./Scene/TiledMap";
import { Vec } from "./Core/Vec";
import { Engine } from "./Core/Engine";
import testmap from "./assets/maps/testmap.tmj";
import { Player } from "./Game/Player";
import { EntityRegistry } from "./Core/EntityRegistry";
import { Sprite } from "./Scene/Sprite";
import img from "./assets/images/player.png";

const engine = new Engine("canvas", {
  debug: {
    collider: true,
  },
});

EntityRegistry.AddGenerator((objData) => {
  if (objData.type == "switch") {
    return new Sprite({
      img_path: img,
      name: objData.name,
      position: new Vec(objData.x, objData.y),
    });
  }
  return null;
});

engine.root_node.position = new Vec(400, 400);

const player = new Player();
player.position = new Vec(100, 100);

const map = new TiledMap({ name: "Map" });
map.scale = new Vec(2, 2);
map.loadTMJ(testmap);
map.colliders.forEach((c) => engine.addCollider(c));
engine.root_node.debugPrint();

engine.root_node.addChild(map);
engine.root_node.addChild(player);

engine.userUpdate = (engine: Engine) => {
  engine.camera_position = player.position
    .subScalar(window.innerWidth / 2, window.innerHeight / 2)
    .rounded();
};

engine.start();
