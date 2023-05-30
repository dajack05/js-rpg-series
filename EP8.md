# Episode IIX

## Move to velocity based movement
- Use velocity in Player
  - Create the variable
  - Update Velocity instead of collider directly.
  - Update collider based on velocity
    - Divide move_vec
      - Update Vec to allow numbers directly
    - "clip" velocity based on collision
    - Add damping
    - Limit damping to X-Axis

## "Camera" movement
- Demo movement by offsetting root position
  - Create `world_position` system
    - set and unset `child.parent` on `addChild()` and `removeChild()`
    - In `Update()` apply parent's world position and scale
    - Update all nodes to use `world_...` when appropriate
      - Player
        - Attach sprite to collider
        - Make self Collider
  - Translate root in `app.ts`
  - Add world colliders to root so they follow
  - Create helper functions in `Engine` to control camera
    - Make `setCameraPositon` centered
        ```ts
        this.root.position = position.sub(new Vec(this.canvas.width / 2, this.canvas.height / 2)).multScalar(-1);
        ```
- Enable camera smooth movement
  - Add toggle in `Engine`
  - Add camera target
  - Set target in `setCameraPosition`
  - Move to target in `loop`
  - Lerp to target if `smoothCamera == true`
  - Add `smoothSpeed` to shape smoothing