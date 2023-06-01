import { Vec } from "./Vec";

export class InputManager {
    private static downkeys = new Map<string, boolean>();
    private static needsInit = true;

    private static touches = new Map<Number, Vec>();

    private static Init() {
        document.addEventListener('keyup', (e) => this.downkeys.set(e.key, false));
        document.addEventListener('keydown', (e) => this.downkeys.set(e.key, true));
        document.addEventListener('touchstart', (e) => {
            for (const touch of e.changedTouches) {
                this.touches.set(touch.identifier, new Vec(touch.clientX, touch.clientY));
            }
        });
        document.addEventListener('touchmove', (e) => {
            for (const touch of e.changedTouches) {
                this.touches.set(touch.identifier, new Vec(touch.clientX, touch.clientY));
            }
        });
        document.addEventListener('touchend', (e) => {
            for (const touch of e.changedTouches) {
                this.touches.delete(touch.identifier);
            }
        });
        document.addEventListener('touchcancel', (e) => {
            for (const touch of e.changedTouches) {
                this.touches.delete(touch.identifier);
            }
        });
        this.needsInit = false;
    }

    static GetTouches(): Vec[] {
        return Array.from(this.touches.values());
    }

    static SetKeyDown(key: string, value: boolean) {
        this.downkeys.set(key, value);
    }

    static IsKeyDown(key: string): boolean {
        if (this.needsInit) {
            this.Init();
        }

        const value = this.downkeys.get(key);
        return value == true;
    }
}