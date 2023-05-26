# Episode V

## Math Refactor
- Create Vec class
- Add Sub Mult Div
- Replace `Rect` with two `Vec`s
- Replace `position_x` with `Vec`
- Replace functions asking for `x,y` with `Vec`
- Replace `source` and `dest` with rects in Engine::drawImage
- Move `Rect` to `Vec.ts`
- Constructor for `Rect`

## Collision Detection
- Create a collider class
- Add overlaps method
```ts
    overlaps(other: Collider): boolean {
        const is_in_x = other.origin.x < this.origin.x + this.size.x && other.origin.x + other.size.x > this.origin.x;
        const is_in_y = other.origin.y < this.origin.y + this.size.y && other.origin.y + other.size.y > this.origin.y;
        return is_in_x && is_in_y;
    }
```
- Add draw method
  - Stroke Rect. Add to Engine
- Create simple floor collider
- Create player collider
- Player collider Follows player
- Check if overlapping