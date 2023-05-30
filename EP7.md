# Episode VII

## Refactor to Nodes
- Create `Scene/Node.ts` class
  - Class should have add/remove child, update, and draw.
- Migrate player to be a `Node`
  - Make sure to call `super.*`
  - Use `override` for a reminder
  - For now, move gravity into `Player.ts`
- Move `CollisionWorld` into engine so we can access it
  - Move `loop` into the engine
  - Move `world.update` and `world.draw` into `Engine.ts`

## Make `Sprite` a `Node`