import { Engine } from "../Core/Engine";
import { Vec } from "../Core/Vec";
import Node from "./Node";

export class Collider extends Node {
    private isAddedToWorld = false;
    
    extents = new Vec(16, 16);
    isColliding = false;

    onUpdate(engine:Engine): void {
        if(!this.isAddedToWorld){
            engine.world.addCollider(this);
            this.isAddedToWorld = true;
        }
        super.onUpdate(engine);
    }
}