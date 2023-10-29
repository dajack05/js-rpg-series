import { Context, Engine } from "../Core/Engine";
import { Node , NodeProperties } from "./Node";

export type Animation = {
  name: string;
  start_frame: number;
  end_frame: number;
  fps: number;
  frame: number;
  counter: number;
  loop: boolean;
};

export const MakeAnimation = (
  name: string,
  start_frame: number,
  end_frame: number,
  loop = true,
  fps?: number
): Animation => ({
  name,
  start_frame,
  end_frame,
  loop,
  fps: fps || 1.0,
  counter: 0,
  frame: start_frame,
});

export type SpriteSheetConfig = {
  cols: number;
  rows: number;
};

export type SpriteProperties = NodeProperties & {
  sheet_config?: SpriteSheetConfig;
  img_path?: string;
};

export class Sprite extends Node {
  image = new Image();

  private isReady = false;

  spriteSheet: SpriteSheetConfig;

  private animations: Animation[] = [];
  private currentAnimation = -1;

  constructor(properties: SpriteProperties = {}) {
    super(properties);
    this.image.onload = () => {
      this.isReady = true;
    };

    if (properties.img_path) {
      this.load(properties.img_path);
    }

    this.spriteSheet = properties.sheet_config || { cols: 1, rows: 1 };
  }

  load(path: string): void {
    this.isReady = false;
    this.image.src = path;
  }

  addAnimation(animation: Animation): void {
    for (let i = 0; i < this.animations.length; i++) {
      if (this.animations[i].name == animation.name) {
        this.animations[i] = animation;
        return;
      }
    }

    this.animations.push(animation);
  }

  playAnimation(name: string, reset = false): void {
    for (let i = 0; i < this.animations.length; i++) {
      if (this.animations[i].name == name) {
        this.currentAnimation = i;
        if(reset){
          this.animations[this.currentAnimation].frame = this.animations[this.currentAnimation].start_frame;
        }
        return;
      }
    }

    console.error(`Failed to find animation named "${name}"`, this);
  }

  getPlayingAnimation(): Animation | null {
    if (this.currentAnimation >= 0) {
      return this.animations[this.currentAnimation];
    }
    return null;
  }

  override onUpdate(engine: Engine): void {
    super.onUpdate(engine);

    if(!this.active) return;
    
    if (this.currentAnimation >= 0 && this.animations.length > 0) {
      const anim = this.animations[this.currentAnimation];
      anim.counter += engine.getDelta();
      if (anim.counter > anim.fps) {
        const is_forward = anim.end_frame >= anim.start_frame;
        if (is_forward) {
          anim.frame++;
          anim.counter = 0.0;
          if (anim.frame >= anim.end_frame) {
            anim.frame = anim.loop ? anim.start_frame : anim.end_frame;
          }
        } else {
          anim.frame--;
          anim.counter = 0.0;
          if (anim.frame < anim.end_frame) {
            anim.frame = anim.loop ? anim.start_frame : anim.end_frame;
          }
        }
      }
    }
  }

  drawFrame(context: Context, frame: number) {
    if (this.isReady) {
      const sub_width = this.image.width / this.spriteSheet.cols;
      const sub_height = this.image.height / this.spriteSheet.rows;

      const frame_x = frame % this.spriteSheet.cols;
      const frame_y = Math.floor(frame / this.spriteSheet.cols);

      const x_offset = frame_x * sub_width;
      const y_offset = frame_y * sub_height;

      const draw_width = sub_width * this.global_scale.x;
      const draw_height = sub_width * this.global_scale.y;

      context.drawImage(
        this.image,
        x_offset,
        y_offset,
        sub_width,
        sub_height,
        this.global_position.x - draw_width / 2,
        this.global_position.y - draw_height / 2,
        draw_width,
        draw_height
      );
    }
  }

  override onDraw(engine: Engine): void {
    if(!this.active) return;
    this.drawFrame(
      engine.ctx,
      this.animations[this.currentAnimation]?.frame || 0
    );
    super.onDraw(engine);
  }
}
