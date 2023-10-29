export class Input {
  private static didInit = false;
  private static downKeys: Map<string, boolean> = new Map<string, boolean>();
  private static lockedKeys: Map<string, boolean> = new Map<string, boolean>();

  static IsKeyPressed(key: string): boolean {
    if (!Input.didInit) {
      Input.Init();
    }
    if (this.lockedKeys.get(key) == true) {
      return false;
    }
    return Input.downKeys.get(key) || false;
  }

  static Init() {
    if (Input.didInit) {
      return;
    }

    document.addEventListener("keydown", (e) => this.downKeys.set(e.key, true));
    document.addEventListener("keyup", (e) => {
      this.downKeys.set(e.key, false);
      this.lockedKeys.set(e.key, false);
    });

    Input.didInit = true;
  }

  static LockKey(key: string) {
    this.lockedKeys.set(key, true);
  }
}
