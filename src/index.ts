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

    /**
     * Returns 2D cross product of this x that.
     *
     * Equivalent to embedding this and that in the XY plane and returning the Z value of the product vector
     * (such a vector would be of the form (0, 0, z)).
     */
    Cross(that: Vec2): number {
        return this.x * that.y - this.y * that.x;
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

    /**
     * Returns the angle between this vector and the x-axis.
     *
     * Returns the angle between this vector and (1, 0), in radians, in the range (-Pi, +Pi].
     */
    Argument(): number {
        return Math.atan2(this.y, this.x);
    }

    /** Returns a copy of this vector. */
    Clone(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    /** Returns a copy of this vector, scaled if needed so its magnitude is at most 'length'. */
    Cap(length: number): Vec2 {
        if (length <= Number.EPSILON) {
            return new Vec2(0, 0);
        }
        const mag = this.Mag();
        if (length < mag) {
            return this.Times(length / mag);
        }
        return this.Clone();
    }

    /** Returns a copy of this vector, swapping x and y. */
    Transpose(): Vec2 {
        return new Vec2(this.y, this.x);
    }

    /** Returns the orthogonal vector v such that (this, v) is a right-handed basis, and |v| = |this|. */
    Orthogonal(): Vec2 {
        return new Vec2(-this.y, this.x);
    }
}

/** Returns the Euclidean distance between u and v. */
export const Dist = (u: Vec2, v: Vec2): number => u.Sub(v).Mag();

/** Returns a Vec2 (Cartesian coordinates) corresponding to the polar coordinates (radius, angle). */
export const FromPolar = (radius: number, angle: number): Vec2 => new Vec2(radius * Math.cos(angle), radius * Math.sin(angle));

/** Linearly interpolate between a at t=0 and b at t=1 (t is NOT clamped). */
export const Interpolate = (a: Vec2, b: Vec2, t: number): Vec2 => a.Add(b.Sub(a).Times(t));

/** Calculate the average vector. */
export const Average = (...vecs: Vec2[]): Vec2 => {
    let accumulator = new Vec2(0, 0);
    if (vecs.length == 0) {
        return accumulator;
    }

    for (let vec of vecs) {
        accumulator = accumulator.Add(vec);
    }

    return accumulator.Div(vecs.length);
}

/**
 * Calculate the weighted average vector.
 *
 * * Iterates up to shortest length.
 * * Ignores negative or approximately zero weights and their associated vectors.
 */
export const WeightedAverage = (vecs: Vec2[], weights: number[]): Vec2 => {
    let accumulator = new Vec2(0, 0);
    let totalWeight = 0;

    const N = Math.min(vecs.length, weights.length);
    if (N == 0) {
        return accumulator;
    }

    for (let i = 0; i < N; i++) {
        const vec = vecs[i];
        const weight = weights[i];
        if (weight > Number.EPSILON) {
            totalWeight += weight;
            accumulator = accumulator.Add(vec.Times(weight));
        }
    }

    if (totalWeight > Number.EPSILON) {
        return accumulator.Div(totalWeight);
    } else {
        return accumulator;
    }
}

/** Returns the projection of arbitrary vector 'v' into *unit* vector 'n', as a Vec2. */
export const Project = (v: Vec2, n: Vec2): Vec2 => n.Times(v.Dot(n));

export const Left  = new Vec2(-1,  0);
export const Right = new Vec2(+1,  0);
export const Up    = new Vec2( 0, +1);
export const Down  = new Vec2( 0, -1);

export const Zero  = new Vec2( 0,  0);
export const One   = new Vec2( 1,  1);