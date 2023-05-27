import { Engine } from "./Engine";
import { Rect, Vec } from "./Vec";

export class Collider extends Rect {
    overlaps(other: Collider): boolean {
        const is_in_x = other.origin.x < this.origin.x + this.size.x && other.origin.x + other.size.x > this.origin.x;
        const is_in_y = other.origin.y < this.origin.y + this.size.y && other.origin.y + other.size.y > this.origin.y;
        return is_in_x && is_in_y;
    }

    draw(engine: Engine) {
        engine.strokeRect(this, "#FF0000");
    }

    translate(translation:Vec){
        this.origin = this.origin.add(translation);
    }
}