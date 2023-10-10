import image from './assets/dungeon_sheet.png'

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

const tileset = new Image();
tileset.onload = ()=>{
    // Do stuff after loading!
    console.log("BAM!");
};
tileset.src = image;