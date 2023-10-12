export class Input {
    private static didInit = false;
    private static downKeys: Map<string, boolean> = new Map<string, boolean>();
 
    static IsKeyPressed(key: string): boolean {
        if(!Input.didInit){
            Input.Init();
        }
        return Input.downKeys.get(key) || false;
    }
 
    static Init() {
        if(Input.didInit){
            return;
        }

        document.addEventListener('keydown', (e) => this.downKeys.set(e.key, true));
        document.addEventListener('keyup', (e) => this.downKeys.set(e.key, false));
        
        Input.didInit = true;
    }
}