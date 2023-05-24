# Episode III

## Refactor input system locally
- Move to `Map<string,boolean>` based input flags
- Simplify keydown and keyup code

## Refactor input system globally
- Create `InputManager` class
- Set keyup and keydown listeners on construct
- Add a `isKeyDown` method
- Refactor main code
- Refactor into static code (only runs one place)

## Refactor engine into its own class
- Create engine source
- Move canvas and ctx into engine