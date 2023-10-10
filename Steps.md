# Inital Setup

- Create `.gitignore`
  - Set to
    ```
    node_modules/
    dist/
    .parcel-cache/
    ```
- `npm init`
- `npm install --save-dev parcel parcel-reporter-static-files-copy typescript`
- Create `src/index.html`
- Create `src/index.ts`
- Update `package.json` with
    ```json
    "source": "src/index.html",
    "scripts": {
        "start":"parcel",
        "build":"parcel build"
    },
    "staticFiles":{
        "staticPath":"src/resources/images/"
    },
    ```
- Include `index.ts`
    ```html
    <script src="index.ts"></script>
    ```

# Getting starter assets

Tileset: https://opengameart.org/content/a-blocky-dungeon

- Download the tileset
- Create canvas