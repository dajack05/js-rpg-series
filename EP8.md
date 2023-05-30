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

