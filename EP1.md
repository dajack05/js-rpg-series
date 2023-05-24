# Episode 1

## Init node env
`npm init`

## Add TS stuff
`npm install --save-dev typescript @types/node parcel`

## Init TS
`npx tsc init`

## Create .gitignore
```
node_modules/
.parcel-cache/
dist/
```

## Create boilerplate stuff
1. Create `src/`
2. Create `src/index.html`
   - Include `.ts` files in `html` 👍

## Update `package.json` with new scripts
1. Remove `"main": "index.js",`
2. Add `"source":"src/index.html",`
3. Add 
```json
"scripts": {
    "dev":"parcel",
    "build":"parcel build"
},
```

## Simple Proto
1. Create Canvas
2. Attach to body
3. Get context2d
4. fill BG
5. Resize Canvas
6. Fix Styling
7. Fill random boxes