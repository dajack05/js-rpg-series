# Episode VI

## Simple Single-body Collision Solving
- Check player collision every frame
    - Store movement in vector
    - Move Collider and attach sprite
    - Check Y collision
    - Check X collision

## Multi-body Solving
- Create `CollisionWorld` class
- Add "is colliding" flag to `Collider`
- 2D loop for checking
- Add `CollisionWorld` to app
- Add Gravity!

## Only jump IF we're grounded
- Create grounded variable
- Only jump IF grounded
```ts
if (InputManager.IsKeyDown(' ') && player_is_grounded) {...}
```
- Reset IF we've collided with something and moving downward (+Y)
```ts
player_collider.translate(move_vec.mult(new Vec(0, 1)));
world.checkCollider(player_collider);
if (player_collider.isColliding) {
    // Player is colliding on the Y axis.
    if (move_vec.y > 0) {
        // Player was decending. Must be ground
        player_is_grounded = true;
    }
    player_collider.translate(move_vec.mult(new Vec(0, -1)));
}
```