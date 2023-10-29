import { Input } from "../Core/Input";
import { Collider, ColliderType } from "../Scene/Collider";
import { Sprite, MakeAnimation } from "../Scene/Sprite";
import { Vec } from "../Core/Vec";
import playerSheet from "../assets/images/player.png";
import { Engine } from "../Core/Engine";
import { NodeProperties } from "../Scene/Node";

enum Anim {
  IDLE = "idle",
  DIE = "die",
  N = "walk_north",
  S = "walk_south",
  E = "walk_east",
  W = "walk_west",
}

export class Player extends Collider {
  move_speed = 2.0;

  sprite = new Sprite({ name: "Player Sprite" });

  constructor(properties: NodeProperties = {}) {
    super({ ...properties, name: "Player" });
    this.addChild(this.sprite);

    this.sprite.load(playerSheet);
    this.sprite.spriteSheet = {
      cols: 9,
      rows: 5,
    };
    this.offset = new Vec(0, 24);
    this.extents = new Vec(8, 8);

    this.sprite.addAnimation(MakeAnimation(Anim.IDLE, 18, 20, true, 1.5));
    this.sprite.addAnimation(MakeAnimation(Anim.N, 1, 9, true, 1 / 10));
    this.sprite.addAnimation(MakeAnimation(Anim.W, 10, 18, true, 1 / 10));
    this.sprite.addAnimation(MakeAnimation(Anim.S, 19, 27, true, 1 / 10));
    this.sprite.addAnimation(MakeAnimation(Anim.E, 28, 36, true, 1 / 10));

    this.sprite.addAnimation(MakeAnimation(Anim.DIE, 38, 41, false, 1 / 20));

    this.sprite.playAnimation(Anim.IDLE);
  }

  override onUpdate(engine: Engine): void {

    if(Input.IsKeyPressed('Escape')){
      engine.broadcast("stop",{});
    }

    let moveVec = new Vec();

    this.sprite.playAnimation(Anim.IDLE);

    if (Input.IsKeyPressed("w")) {
      this.sprite.playAnimation(Anim.N);
      moveVec.y -= 1;
    }
    if (Input.IsKeyPressed("s")) {
      this.sprite.playAnimation(Anim.S);
      moveVec.y += 1;
    }

    this.checkCollision(engine, this.global_position.add(moveVec));
    if (this.isColliding() && this.collidingWith?.type != ColliderType.TRIGGER) {
      moveVec.y = 0;
    }

    if (Input.IsKeyPressed("a")) {
      this.sprite.playAnimation(Anim.W);
      moveVec.x -= 1;
    }
    if (Input.IsKeyPressed("d")) {
      this.sprite.playAnimation(Anim.E);
      moveVec.x += 1;
    }

    this.checkCollision(engine, this.global_position.add(moveVec));
    if (this.isColliding() && this.collidingWith?.type != ColliderType.TRIGGER) {
      moveVec.x = 0;
    }

    this.position = this.position.add(moveVec);
    super.onUpdate(engine);
  }
}
