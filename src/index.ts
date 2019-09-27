export class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /** Returns this + that. */
    Add(that: Vec2): Vec2 {
        return new Vec2(this.x + that.x, this.y + that.y);
    }

    /** Returns this - that. */
    Sub(that: Vec2): Vec2 {
        return new Vec2(this.x - that.x, this.y - that.y);
    }

    /** Returns this * that (dot product). */
    Dot(that: Vec2): number {
        return this.x * that.x + this.y * that.y;
    }

    /** Returns k * this (scalar product). */
    Times(k: number): Vec2 {
        return new Vec2(k * this.x, k * this.y);
    }

    /** Returns (1/k) * this (scalar division). */
    Div(k: number): Vec2 {
        return new Vec2(this.x / k, this.y / k);
    }

    /** Returns -this. */
    Negate(): Vec2 {
        return this.Times(-1);
    }

    /** Returns the squared magnitude of this vector. */
    MagSqr(): number {
        return this.x * this.x + this.y * this.y;
    }

    /** Returns the magnitude of this vector. */
    Mag(): number {
        return Math.sqrt(this.MagSqr());
    }

    /** Returns a normalized copy of this vector. */
    Normalized(): Vec2 {
        return this.Div(this.Mag());
    }

    /** Returns the angle between this vector and the x-axis. */
    Argument(): number {
        return Math.atan2(this.y, this.x);
    }
}

/** Returns a Vec2 (Cartesian coordinates) corresponding to the polar coordinates (radius, angle). */
export function fromPolar(radius: number, angle: number): Vec2 {
    return new Vec2(radius * Math.cos(angle), radius * Math.sin(angle));
}
