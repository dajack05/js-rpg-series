import { Engine } from "./Engine";
import { InputManager } from "./InputManager";
import { Node } from "./Scene/Node";
import { Sprite } from "./Scene/Sprite";
import { Rect, Vec } from "./Vec";
import controls_img from "./resources/images/mobile_controls.png"

export class MobileControls extends Node {
    private sprite = new Sprite(controls_img);

    private left_button_rect = new Rect();
    private right_button_rect = new Rect();
    private jump_button_rect = new Rect();

    constructor(canvas_size: Vec) {
        super();
        this.sprite.setSubSize(16);
        this.sprite.transform.setScale(5);

        const bottom_left = canvas_size.mult(new Vec(0, 1));
        const bottom_right = canvas_size.mult(new Vec(1, 1));
        const button_size = new Vec(this.sprite.getSubSize() * this.sprite.transform.getScale(), this.sprite.getSubSize() * this.sprite.transform.getScale());
        this.left_button_rect = new Rect(bottom_left.add(new Vec(10, -button_size.y - 10)), button_size);
        this.right_button_rect = new Rect(bottom_left.add(new Vec(button_size.x + 20, -button_size.y - 10)), button_size);
        this.jump_button_rect = new Rect(bottom_right.sub(new Vec(button_size.x + 10, button_size.y + 10)), button_size);
    }

    override update(engine: Engine): void {
        super.update(engine);

        // Look for input
        const touches = InputManager.GetTouches();
        InputManager.SetKeyDown('a', false);
        InputManager.SetKeyDown('d', false);
        InputManager.SetKeyDown(' ', false);
        for (const touch of touches) {
            if (this.left_button_rect.isWithin(touch)) {
                InputManager.SetKeyDown('a', true);
            }
            if (this.right_button_rect.isWithin(touch)) {
                InputManager.SetKeyDown('d', true);
            }
            if (this.jump_button_rect.isWithin(touch)) {
                InputManager.SetKeyDown(' ', true);
            }
        }
    }

    override draw(engine: Engine): void {
        super.draw(engine);

        const bottom_left = engine.getCanvasSize().mult(new Vec(0, 1));
        const bottom_right = engine.getCanvasSize().mult(new Vec(1, 1));

        const button_size = new Vec(this.sprite.getSubSize() * this.sprite.transform.getScale(), this.sprite.getSubSize() * this.sprite.transform.getScale());

        // Left Arrow
        this.sprite.animation.frame = 0;
        this.sprite.calculateSource();
        this.sprite.transform.setPosition(
            bottom_left
                .sub(button_size.mult(new Vec(0, 1)))
                .add(new Vec(10, -10))
        );
        this.sprite.draw(engine);

        // Right Arrow
        this.sprite.animation.frame = 1;
        this.sprite.calculateSource();
        this.sprite.transform.setPosition(
            bottom_left
                .sub(button_size.mult(new Vec(0, 1)))
                .add(button_size.mult(new Vec(1, 0)))
                .add(new Vec(20, -10))
        );
        this.sprite.draw(engine);

        // Jump Arrow
        this.sprite.animation.frame = 2;
        this.sprite.calculateSource();
        this.sprite.transform.setPosition(
            bottom_right
                .sub(button_size.mult(new Vec(1, 1)))
                .sub(new Vec(10, 10))
        );
        this.sprite.draw(engine);
    }
}