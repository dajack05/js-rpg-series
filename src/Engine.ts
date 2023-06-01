import { CollisionWorld } from "./CollisionWorld";
import { Node } from "./Scene/Node";
import { SoundRegistry } from "./Scene/Sound";
import { Rect, Vec } from "./Vec";

export interface EngineConfig {
    debug?: boolean,
    camera?: {
        smooth?: boolean,
        speed?: number,
    }
    muteSound?: boolean,
    parallax?: {
        x: number,
        y: number
    }
}

export class Engine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private userUpdate = (engine: Engine) => { };
    private userDraw = (engine: Engine) => { };

    private paused = true;

    root = new Node();
    collisionWorld = new CollisionWorld();

    readonly config: EngineConfig = {
        debug: false,
        camera: {
            smooth: true,
            speed: 0.1,
        },
        muteSound: false,
        parallax: {
            x: 1.0,
            y: 0.5,
        }
    };
    private cameraTarget = new Vec(0, 0);

    constructor(config?: EngineConfig) {
        this.canvas = document.createElement('canvas') as HTMLCanvasElement;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.ctx.imageSmoothingEnabled = false;

        document.body.append(this.canvas);

        if (config) {
            this.config = { ...this.config, ...config };
        }

        if (this.config.muteSound === true) {
            SoundRegistry.Pause();
        }

        document.addEventListener('click', () => {
            if (this.paused) {
                this.paused = false;
                if (this.config.muteSound === false) {
                    SoundRegistry.Resume();
                }
            }
        });

        window.addEventListener("blur", () => {
            this.paused = true;
            SoundRegistry.Pause();
        });

        this.update();
        this.loop();
    }

    isPaused(): boolean {
        return this.paused;
    }

    getRenderContext(): CanvasRenderingContext2D {
        return this.ctx;
    }

    clear() {
        this.ctx.fillStyle = "#cccccc";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawImage(image: HTMLImageElement, source: Rect, dest: Rect) {
        this.ctx.drawImage(image,
            source.origin.x, source.origin.y, source.size.x, source.size.y,
            dest.origin.x, dest.origin.y, dest.size.x, dest.size.y,
        );
    }

    strokeRect(rect: Rect, color: string, thickness = 2) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = thickness;
        this.ctx.strokeRect(rect.origin.x, rect.origin.y, rect.size.x, rect.size.y);
    }

    setUserFunctions(userUpdate: (engine: Engine) => void = () => { }, userDraw: (engine: Engine) => void = () => { }) {
        this.userUpdate = userUpdate;
        this.userDraw = userDraw;
    }

    setCameraPosition(position: Vec) {
        this.cameraTarget = position.sub(new Vec(this.canvas.width / 2, this.canvas.height / 2)).multScalar(-1);
    }

    getCameraPosition(): Vec {
        return this.root.transform.getWorldPosition().multScalar(-1);
    }

    getCanvasSize(): Vec {
        return new Vec(this.canvas.width, this.canvas.height);
    }

    private update() {
        this.collisionWorld.update();
        this.root.update(this);
        this.userUpdate(this);
    }

    private draw() {
        this.clear();
        this.root.draw(this);
        this.userDraw(this);
    }

    private loop() {
        if (this.config.camera?.smooth) {
            this.root.transform.translate(this.cameraTarget.sub(this.root.transform.getPosition()).multScalar(this.config.camera.speed!));
        } else {
            this.root.transform.setPosition(this.cameraTarget);
        }

        if (!this.paused) {
            this.update();
        }

        this.draw();

        if (this.paused) {
            this.ctx.fillStyle = "rgba(0,0,0,0.7)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.strokeStyle = "#000000";
            this.ctx.lineWidth = this.canvas.width / 100;

            {
                this.ctx.font = `${this.canvas.width / 10}px 'Courier New', Courier, monospace`;
                const metrics = this.ctx.measureText("PAUSED");
                this.ctx.strokeText("PAUSED", (this.canvas.width / 2) - (metrics.width / 2), this.canvas.height * 0.4);
                this.ctx.fillText("PAUSED", (this.canvas.width / 2) - (metrics.width / 2), this.canvas.height * 0.4);
            }
            {
                this.ctx.font = `${this.canvas.width / 20}px 'Courier New', Courier, monospace`;
                const metrics = this.ctx.measureText("(Click To Resume)");
                this.ctx.strokeText("(Click To Resume)", (this.canvas.width / 2) - (metrics.width / 2), this.canvas.height * 0.6);
                this.ctx.fillText("(Click To Resume)", (this.canvas.width / 2) - (metrics.width / 2), this.canvas.height * 0.6);
            }
        }

        if (this.config.debug) {
            this.collisionWorld.draw(this);
            this.root.debugDraw(this);
        }

        requestAnimationFrame(this.loop.bind(this));
    }
}