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
- Make `Sprite` extend `Node`
- Remove redundant private vars
- Modify override draw
- `addChild` instead of one-off updates in `Player`

## Make `Collider` a `Node`
- Make `Collider` extend `Node`
- Add constructor to set offset and size
- Make an `offset` variable to allow changed origin
- Make conviencence function to get origin
- update `overlaps`
- Override and update `draw`
- Move `translate` into `Node`
- `Player` needs to get and set position NOT origin
- Trim `Player.collider` to fit `Player.sprite`

## Create Root Node in Engine
