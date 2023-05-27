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