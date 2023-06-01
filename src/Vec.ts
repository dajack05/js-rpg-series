export class Vec {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    add(other: Vec): Vec {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    sub(other: Vec): Vec {
        return new Vec(this.x - other.x, this.y - other.y);
    }

    mult(other: Vec): Vec {
        return new Vec(this.x * other.x, this.y * other.y);
    }

    multScalar(scalar: number): Vec {
        return new Vec(this.x * scalar, this.y * scalar);
    }

    div(other: Vec): Vec {
        return new Vec(this.x / other.x, this.y / other.y);
    }

    divScalar(scalar: number): Vec {
        return new Vec(this.x / scalar, this.y / scalar);
    }

    clone(): Vec {
        return new Vec(this.x, this.y);
    }

    round(): Vec {
        return new Vec(Math.round(this.x), Math.round(this.y));
    }
}

export class Rect {
    origin: Vec;
    size: Vec;

    constructor(origin = new Vec(0, 0), size = new Vec(1, 1)) {
        this.origin = origin;
        this.size = size;
    }

    isWithin(point: Vec): boolean {
        return point.x > this.origin.x && point.x < this.origin.x + this.size.x && point.y > this.origin.y && point.y < this.origin.y + this.size.y;
    }
}