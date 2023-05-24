# Episode II

# Loading and rendering an image
- Render an image
    - Create image
    - Set src to `https://picsum.photos/${img_size}`
    - Refactor drawing code to draw image instead

# Loading and rendering OUR image
- Grab an [image](https://opengameart.org/content/classic-hero)
    - Modify it for our use
        - Crop/Transparent
        - Rename to old_hero[16x16].png
        - Store it somewhere like /src/resources/image/XYZ.png
- Get path with require `import old_hero from "./resources/images/old_hero[16x16].png";`
- Create `/src/resources/images/index.d.ts` which includes
```ts
declare module '*.png' {
    const value: any;
    export = value;
}
```
- Add image onLoad function to trigger drawing
- Refactor drawing code to draw image in middle of screen
- Correct image scaling interpolation `ctx.imageSmoothingEnabled = false;`

## Show a subsection of the image
[Mozilla Ref](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)

- Implement same design while using the src/dst drawImage mode

- Draw frame 1 by using width and height of 16px

## Make game loop
- Make loop function which uses `requestAnimationFrame(`
- Get keyboard input
- Move player
- Clear screen
- Fix stutter (is_w_pressed, ...)
- Add keyup event
- Move update stuff to `update()`
