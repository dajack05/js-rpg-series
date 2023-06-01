import { Engine } from "./Engine";
import { Node } from "./Scene/Node";
import { Vec } from "./Vec";

export class Transform {
    private position = new Vec(0, 0);
    private scale = 1.0;

    private world_position = new Vec(0, 0);
    private world_scale = 1.0;

    private owner: Node;

    constructor(owner: Node) {
        this.owner = owner;
    }

    setScale(scale: number) {
        this.scale = scale;
        this.update();
    }

    getScale(): number {
        return this.scale;
    }

    getWorldScale(): number {
        return this.world_scale;
    }

    setPosition(position: Vec) {
        this.position = position.clone();
        this.update();
    }

    getPosition(): Vec {
        return this.position.clone();
    }

    getWorldPosition(): Vec {
        return this.world_position.clone();
    }

    translate(translation: Vec) {
        this.position = this.position.add(translation);
        this.update();
    }

    update() {
        // If we have a parent
        if (this.owner.parent !== null) {
            // Update world coords
            this.world_position = this.owner.parent.transform.getWorldPosition().add(this.position);
            this.world_scale = this.owner.parent.transform.getWorldScale() * this.scale;
        } else {
            // Default
            this.world_position = this.position;
            this.world_scale = this.scale;
        }
    }

    debugDraw(engine: Engine) {
        const ctx = engine.getRenderContext();

        const screen_position = this.getWorldPosition();

        // X
        ctx.strokeStyle = "#F00";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(screen_position.x, screen_position.y);
        ctx.lineTo(screen_position.x + 50, screen_position.y);
        ctx.stroke();

        // Y
        ctx.strokeStyle = "#0F0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(screen_position.x, screen_position.y);
        ctx.lineTo(screen_position.x, screen_position.y + 50);
        ctx.stroke();
    }
}