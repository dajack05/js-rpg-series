export class Vec {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    add(vec: Vec): Vec {
        return new Vec(this.x + vec.x, this.y + vec.y);
    }

    addScalar(x: number, y: number): Vec {
        return this.add(new Vec(x, y));
    }

    sub(vec: Vec): Vec {
        return new Vec(this.x - vec.x, this.y - vec.y);
    }

    subScalar(x: number, y: number): Vec {
        return this.sub(new Vec(x, y));
    }

    mult(vec: Vec): Vec {
        return new Vec(this.x * vec.x, this.y * vec.y);
    }

    multScalar(x: number, y?: number): Vec {
        if (y) {
            return this.mult(new Vec(x, y));
        } else {
            return this.mult(new Vec(x, x));
        }
    }

    div(vec: Vec): Vec {
        return new Vec(this.x / vec.x, this.y / vec.y);
    }

    divScalar(x: number, y?: number): Vec {
        if (y) {
            return this.div(new Vec(x, y));
        } else {
            return this.div(new Vec(x, x));
        }
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    distanceTo(other: Vec): number {
        return other.sub(this).length();
    }

    normalized(): Vec {
        return this.divScalar(this.length());
    }

    rounded(): Vec {
        return new Vec(Math.round(this.x), Math.round(this.y));
    }
};