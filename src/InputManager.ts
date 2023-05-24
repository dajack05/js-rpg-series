export class InputManager {
    private static downkeys = new Map<string, boolean>();
    private static needsInit = true;

    private static Init(){
        document.addEventListener('keyup', (e) => this.downkeys.set(e.key, false));
        document.addEventListener('keydown', (e) => this.downkeys.set(e.key, true));
        this.needsInit = false;
    }

    static IsKeyDown(key: string): boolean {
        if(this.needsInit){
            this.Init();
        }

        const value = this.downkeys.get(key);
        return value == true;
    }
}