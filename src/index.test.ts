import {
    Vec2,
    Dist, FromPolar, Interpolate, Average, WeightedAverage, Project,
} from './index';

// Handy helpers!
const compare = (a: Vec2, b: any) => {
    expect(a.x).toBeCloseTo(b.x);
    expect(a.y).toBeCloseTo(b.y);
}
const Pi = Math.PI;

test("constructor takes parameters (x: number, y: number), which correspond to respective fields. They are represented internally by an array.", () => {
    const v1 = new Vec2(0, 0);
    const v2 = new Vec2(1, 0);
    const v3 = new Vec2(0, 1);
    const v4 = new Vec2(1, 1);
    const v5 = new Vec2(-2, 3.5);

    expect(v1).toEqual({ values: [ 0, 0 ] });
    expect(v1.x).toEqual(0);
    expect(v1.y).toEqual(0);

    expect(v2).toEqual({ values: [ 1, 0 ] });
    expect(v2.x).toEqual(1);
    expect(v2.y).toEqual(0);

    expect(v3).toEqual({ values: [ 0, 1 ] });
    expect(v3.x).toEqual(0);
    expect(v3.y).toEqual(1);

    expect(v4).toEqual({ values: [ 1, 1 ] });
    expect(v4.x).toEqual(1);
    expect(v4.y).toEqual(1);

    expect(v5).toEqual({ values: [ -2, 3.5 ] });
    expect(v5.x).toEqual( -2);
    expect(v5.y).toEqual(3.5);

});

test("constructor also takes parameter (values: number[]), which correspond to respective fields. They are represented internally by an array.", () => {
    const v1 = new Vec2([0, 0]);
    const v2 = new Vec2([1, 0]);
    const v3 = new Vec2([0, 1]);
    const v4 = new Vec2([1, 1]);
    const v5 = new Vec2([-2, 3.5]);

    expect(v1).toEqual({ values: [ 0, 0 ] });
    expect(v1.x).toEqual(0);
    expect(v1.y).toEqual(0);

    expect(v2).toEqual({ values: [ 1, 0 ] });
    expect(v2.x).toEqual(1);
    expect(v2.y).toEqual(0);

    expect(v3).toEqual({ values: [ 0, 1 ] });
    expect(v3.x).toEqual(0);
    expect(v3.y).toEqual(1);

    expect(v4).toEqual({ values: [ 1, 1 ] });
    expect(v4.x).toEqual(1);
    expect(v4.y).toEqual(1);

    expect(v5).toEqual({ values: [ -2, 3.5 ] });
    expect(v5.x).toEqual( -2);
    expect(v5.y).toEqual(3.5);

});

test("Vec2.Add(Vec2): Vec2 returns a new sum vector without modifying the originals.", () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, -4);

    const out1 = v1.Add(v2);
    expect(out1).toEqual(new Vec2(4, -2));
    expect(v1).toEqual(new Vec2(1, 2)); // v1 not modified.
    expect(v2).toEqual(new Vec2(3, -4)); // v2 not modified.

    const out2 = v2.Add(v1);
    expect(out2).toEqual(out1); // Commutativity applies.

    const out3 = v1.Add(v1);
    expect(out3).toEqual(new Vec2(2, 4));

    const out4 = v2.Add(v2);
    expect(out4).toEqual(new Vec2(6, -8));
});

test("Vec2.Sub(Vec2): Vec2 returns a new subtraction vector without modifying the originals.", () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, -4);
    const zero = new Vec2(0, 0);

    const out1 = v1.Sub(v2);
    expect(out1).toEqual(new Vec2(-2, 6));
    expect(v1).toEqual(new Vec2(1, 2)); // v1 not modified.
    expect(v2).toEqual(new Vec2(3, -4)); // v2 not modified.

    const out2 = v2.Sub(v1);
    expect(out2).toEqual(new Vec2(2, -6)); // Sign changes on order change.

    const out3 = v1.Sub(v1);
    expect(out3).toEqual(zero); // Cancellation.

    const out4 = v2.Sub(v2);
    expect(out4).toEqual(zero); // Cancellation.
});

test("Vec2.Dot(Vec2): number returns a scalar corresponding to the dot product, without modifying the originals.", () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, -4);
    const zero = new Vec2(0, 0);
    const one = new Vec2(1, 1);

    const out1 = v1.Dot(v2);
    expect(out1).toBe(-5);
    expect(v1).toEqual(new Vec2(1, 2)); // v1 not modified.
    expect(v2).toEqual(new Vec2(3, -4)); // v2 not modified.

    const out2 = v2.Dot(v1);
    expect(out2).toBe(out1); // Commutativity applies.

    const out3 = v1.Dot(v1);
    expect(out3).toBe(5); // Modulus squared.

    const out4 = v2.Dot(v2);
    expect(out4).toBe(25); // Modulus squared.

    const out5 = v1.Dot(zero);
    expect(out5).toBe(0);

    const out6 = v2.Dot(zero);
    expect(out6).toBe(0);

    const out7 = v1.Dot(one);
    expect(out7).toBe(3); // Trace.

    const out8 = v2.Dot(one);
    expect(out8).toBe(-1); // Trace.
});

test("Vec2.Cross(Vec2): number returns the 2D cross product, without modifying the originals", () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(-2, 1);

    const out1 = v1.Cross(v1);
    expect(out1).toBe(0); // Parallel vectors get nulled.
    expect(v1).toEqual(new Vec2(1, 2)); // Not modified.

    const out2 = v1.Cross(v2);
    expect(out2).toBe(5); // Perpendicular vectors get full modulus.
    expect(v2).toEqual(new Vec2(-2, 1)); // Not modified.
});

test("Vec2.Times(number): Vec2 returns a new scaled vector without modifying the original.", () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, -4);
    const zero = new Vec2(0, 0);

    const out1 = v1.Times(2);
    expect(out1).toEqual(new Vec2(2, 4));
    expect(v1).toEqual(new Vec2(1, 2)); // v1 not modified.

    const out2 = v2.Times(2);
    expect(out2).toEqual(new Vec2(6, -8));
    expect(v2).toEqual(new Vec2(3, -4)); // v2 not modified.

    const out3 = v1.Times(1);
    expect(out3).toEqual(v1); // Identity.

    const out4 = v1.Times(0);
    expect(out4).toEqual(zero); // Zero.
});

test("Vec2.Div(number): Vec2 returns a new scaled vector without modifying the original.", () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, -4);

    const out1 = v1.Div(2);
    expect(out1).toEqual(new Vec2(0.5, 1));
    expect(v1).toEqual(new Vec2(1, 2)); // v1 not modified.

    const out2 = v2.Div(2);
    expect(out2).toEqual(new Vec2(1.5, -2));
    expect(v2).toEqual(new Vec2(3, -4)); // v2 not modified.

    const out3 = v1.Div(1);
    expect(out3).toEqual(v1); // Identity.
});

test("Vec2.Negate(): Vec2 returns a new negated vector without modifying the original.", () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, -4);

    const out1 = v1.Negate();
    expect(out1).toEqual(new Vec2(-1, -2));
    expect(v1).toEqual(new Vec2(1, 2)); // v1 not modified.

    const out2 = v2.Negate();
    expect(out2).toEqual(new Vec2(-3, 4));
    expect(v2).toEqual(new Vec2(3, -4)); // v2 not modified.
});

test("Vec2.MagSqr(): number returns the square magnitude of a vector, without modifying the original.", () => {
    const v1 = new Vec2(1, 0);
    const v2 = new Vec2(3, -4);
    const zero = new Vec2(0, 0);
    const one = new Vec2(1, 1);

    expect(v1.MagSqr()).toBe(1);
    expect(v1).toEqual(new Vec2(1, 0)); // v1 not modified.

    expect(v2.MagSqr()).toBe(25);
    expect(v2).toEqual(new Vec2(3, -4)); // v2 not modified.

    expect(zero.MagSqr()).toBe(0);
    expect(zero).toEqual(new Vec2(0, 0)); // zero not modified.

    expect(one.MagSqr()).toBe(2);
    expect(one).toEqual(new Vec2(1, 1)); // one not modified.
});

test("Vec2.MagSqr(): number returns the magnitude of a vector, without modifying the original.", () => {
    const v1 = new Vec2(1, 0);
    const v2 = new Vec2(3, -4);
    const zero = new Vec2(0, 0);
    const one = new Vec2(1, 1);

    expect(v1.Mag()).toBeCloseTo(1);
    expect(v1).toEqual(new Vec2(1, 0)); // v1 not modified.

    expect(v2.Mag()).toBeCloseTo(5);
    expect(v2).toEqual(new Vec2(3, -4)); // v2 not modified.

    expect(zero.Mag()).toBeCloseTo(0);
    expect(zero).toEqual(new Vec2(0, 0)); // zero not modified.

    expect(one.Mag()).toBeCloseTo(Math.sqrt(2));
    expect(one).toEqual(new Vec2(1, 1)); // one not modified.
});

test("Vec2.Normalized(): Vec2 returns a normalized copy of a vector, without modifying the original.", () => {
    const v1 = new Vec2(1, 0);
    const v2 = new Vec2(3, -4);
    const one = new Vec2(1, 1);

    compare(v1.Normalized(), new Vec2(1, 0));
    expect(v1).toEqual(new Vec2(1, 0)); // v1 not modified.

    compare(v2.Normalized(), new Vec2(3 / 5, -4 / 5));
    expect(v2).toEqual(new Vec2(3, -4)); // v2 not modified.

    compare(one.Normalized(), new Vec2(Math.sqrt(0.5), Math.sqrt(0.5)));
    expect(one).toEqual(new Vec2(1, 1)); // one not modified.
});

test("Vec2.Argument(): number returns the argument (angle from x-axis, in radians, smallest in modulus) of a vector, without modifying it.", () => {
    const v1 = new Vec2(1, 0);
    const v2 = new Vec2(0, 1);
    const v3 = new Vec2(-1, 0);
    const v4 = new Vec2(0, -1);
    const v5 = new Vec2(1, 1);
    const v6 = new Vec2(Math.sqrt(3) / 2, 0.5);

    expect(v1.Argument()).toBeCloseTo(0.0 * Pi); // 0°
    expect(v2.Argument()).toBeCloseTo(0.5 * Pi); // 90°
    expect(v3.Argument()).toBeCloseTo(1.0 * Pi); // 180°
    expect(v4.Argument()).toBeCloseTo(-0.5 * Pi); // -90° (270°)
    expect(v5.Argument()).toBeCloseTo(0.25 * Pi); // 45°
    expect(v6.Argument()).toBeCloseTo(Pi / 6); // 30°
});

test("Vec2.Clone(): Vec2 returns a copy of the original vector", () => {
    for (let x = -5; x <= +6; x += 1 / 3) {
        for (let y = -7; y <= +8; y += 1 / 4) {
            const v1 = new Vec2(x, y);
            const v2 = v1.Clone();
            expect(v1).toEqual(v2);
            expect(v1).not.toBe(v2);
        }
    }
});

test("Vec2.Cap() returns a length-capped copy of the original vector", () => {
    for (let x = -5; x <= +6; x += 1 / 3) {
        for (let y = -7; y <= +8; y += 1 / 4) {
            const v1 = new Vec2(x, y);
            const v2 = v1.Cap(2);
            const m1 = v1.Mag();
            const m2 = v2.Mag();
            expect(m2).toBeCloseTo(Math.min(2, m1));
            expect(v1).not.toBe(v2);
        }
    }
});

test("Vec2.Transpose() returns a copy of the original vector, swapping x and y", () => {
    const v1 = new Vec2(0, 0);
    const v2 = new Vec2(1, 0);
    const v3 = new Vec2(0, 1);
    const v4 = new Vec2(1, 1);
    const v5 = new Vec2(-2, 3.5);

    expect(v1.Transpose()).toEqual(new Vec2(0  ,  0));
    expect(v2.Transpose()).toEqual(new Vec2(0  ,  1));
    expect(v3.Transpose()).toEqual(new Vec2(1  ,  0));
    expect(v4.Transpose()).toEqual(new Vec2(1  ,  1));
    expect(v5.Transpose()).toEqual(new Vec2(3.5, -2));
});

test("Vec2.Orthogonal() returns the right-hand perpendicular vector (vector to the left) of equal magnitude", () => {
    const zero = new Vec2(0, 0);
    const x    = new Vec2(1, 0);
    const y    = new Vec2(0, 1);

    const radii  = [0.5, 1, 3, 19];
    const angles = [0, Pi / 6, Pi / 2, Pi, 4];

    // Zero is zero
    compare(zero.Orthogonal(), zero);

    // Sanity check.
    compare(x.Orthogonal(), y);
    compare(y.Orthogonal(), x.Negate());

    // The real deal: right-handed orthogonal coordinate system.
    for (const r of radii) {
        for (const a of angles) {
            const u = FromPolar(r, a);
            const v = u.Orthogonal();
            expect(v.Mag()).toBeCloseTo(r);
            expect(u.Dot(v)).toBeCloseTo(0);
            expect(u.Cross(v)).toBeCloseTo(r * r);
        }
    }
});

test("Dist(u,v) returns the Euclidean distance between u and v", () => {
    const v1   = new Vec2(1,  0);
    const v2   = new Vec2(4, -4);
    const zero = new Vec2(0,  0);
    const one  = new Vec2(1,  1);

    // Distance to self is 0.
    expect(Dist(v1  , v1  )).toBeCloseTo(0);
    expect(Dist(v2  , v2  )).toBeCloseTo(0);
    expect(Dist(zero, zero)).toBeCloseTo(0);
    expect(Dist(one , one )).toBeCloseTo(0);

    // Distance to zero is magnitude.
    expect(Dist(zero, v1 )).toBeCloseTo(v1 .Mag());
    expect(Dist(zero, v2 )).toBeCloseTo(v2 .Mag());
    expect(Dist(zero, one)).toBeCloseTo(one.Mag());

    // Misc.
    expect(Dist(v1 , v2)).toBeCloseTo(5);
    expect(Dist(one, v1)).toBeCloseTo(1);
});

test("FromPolar(number, number) returns the Vec2 corresponding to the polar representation (radius, angle).", () => {
    // Radius degeneracy
    compare(FromPolar(0, 0.0 * Pi), new Vec2(0, 0));
    compare(FromPolar(0, 0.5 * Pi), new Vec2(0, 0));
    compare(FromPolar(0, 1.0 * Pi), new Vec2(0, 0));

    // Axes
    compare(FromPolar(1, 0.0 * Pi), new Vec2(1, 0));
    compare(FromPolar(1, 0.5 * Pi), new Vec2(0, 1));
    compare(FromPolar(1, 1.0 * Pi), new Vec2(-1, 0));
    compare(FromPolar(1, 1.5 * Pi), new Vec2(0, -1));

    // 2-Pi excess does not matter.
    compare(FromPolar(1, 0.0 * Pi), new Vec2(1, 0));
    compare(FromPolar(1, 2.0 * Pi), new Vec2(1, 0));
    compare(FromPolar(1, -2.0 * Pi), new Vec2(1, 0));
    compare(FromPolar(1, 4.0 * Pi), new Vec2(1, 0));

    // Scaling works as expected.
    compare(FromPolar(1 * Math.sqrt(2), 0.25 * Pi), new Vec2(1, 1));
    compare(FromPolar(2 * Math.sqrt(2), 0.25 * Pi), new Vec2(2, 2));
    compare(FromPolar(3 * Math.sqrt(2), 0.25 * Pi), new Vec2(3, 3));
});

test("Interpolate(Vec2, Vec2, number): Vec2 returns the unclamped linear interpolation of two vectors", () => {
    const vec1 = new Vec2(0, 0);
    const vec2 = new Vec2(1, 1);
    const vec3 = new Vec2(2, 3);
    const vec4 = new Vec2(-5, 4);

    compare(Interpolate(vec1, vec2, 0), vec1); // t=0 => a.
    compare(Interpolate(vec1, vec2, 1), vec2); // t=1 => b.
    compare(Interpolate(vec1, vec2, 0.5), new Vec2(0.5, 0.5)); // t=1/2 => midpoint.
    compare(Interpolate(vec1, vec2, -1), new Vec2(-1, -1)); // Unclamped.
    compare(Interpolate(vec1, vec2, 2), new Vec2(2, 2)); // Unclamped.

    compare(Interpolate(vec3, vec4, 0), vec3); // t=0 => a.
    compare(Interpolate(vec3, vec4, 1), vec4); // t=1 => b.
    compare(Interpolate(vec3, vec4, 0.5), new Vec2(-1.5, 3.5)); // t=1/2 => midpoint.
    compare(Interpolate(vec3, vec4, -1), new Vec2(9, 2)); // Unclamped.
    compare(Interpolate(vec3, vec4, 2), new Vec2(-12, 5)); // Unclamped.
});

test("Average(...Vec2): Vec2 calculates the arithmetic mean of a sequence of vectors", () => {
    const vec1 = new Vec2(0, 0);
    const vec2 = new Vec2(1, 1);
    const vec3 = new Vec2(2, 3);
    const vec4 = new Vec2(-5, 4);

    compare(Average(), new Vec2(0, 0)); // No vectors => zero element.
    compare(Average(vec1), vec1); // One vector => itself.
    compare(Average(vec1, vec2), new Vec2(0.5, 0.5)); // Two vectors => midpoint.

    compare(Average(vec3), vec3); // One vector => itself.
    compare(Average(vec3, vec4), new Vec2(-1.5, 3.5)); // Two vectors => midpoint.

    compare(Average(vec1, vec2, vec3), new Vec2(1, 4 / 3));
    compare(Average(vec1, vec2, vec3, vec4), new Vec2(-0.5, 2));
});

test("WeightedAverage(Vec2[], number[]): Vec2 calculates the weighted mean of a sequence of vectors", () => {
    const zeroVec = new Vec2(0, 0);
    const vec1 = new Vec2(1, 1);
    const vec2 = new Vec2(2, 3);

    compare(WeightedAverage([], []), zeroVec); // No vectors => zero element.

    compare(WeightedAverage([vec1], [1]), vec1); // One vector => itself.
    compare(WeightedAverage([vec2], [1]), vec2); // One vector => itself.

    compare(WeightedAverage([vec1], [2]), vec1); // Total weight sum does not matter.
    compare(WeightedAverage([vec1], [0]), zeroVec); // Zero weight => get nothing.

    compare(WeightedAverage([vec1, vec2], [10, 0]), vec1);
    compare(WeightedAverage([vec1, vec2], [0, 15]), vec2);
    compare(WeightedAverage([vec1, vec2], [3.5, 3.5]), new Vec2(1.5, 2));
});

test("Project(v, n), with n unit, projects v into <n>", () => {
    const invSqrt2 = Math.sqrt(0.5);
    const zero = new Vec2(0, 0);
    const x = new Vec2(1, 0);
    const y = new Vec2(0, 1);
    const diagonal = new Vec2(invSqrt2, invSqrt2);
    const v = new Vec2(-2, 3.5);

    // Zero projects to zero.
    compare(Project(zero, x), zero);
    compare(Project(zero, y), zero);
    compare(Project(zero, diagonal), zero);

    // Orthogonal vectors project to zero.
    compare(Project(x, y), zero);
    compare(Project(y, x), zero);

    // Projecting at 45 degrees.
    compare(Project(x, diagonal), diagonal.Times(invSqrt2));
    compare(Project(diagonal, x), x.Times(invSqrt2));

    // Algebra!
    compare(Project(v, x), x.Times(-2));
    compare(Project(v, y), y.Times(3.5));
    compare(Project(v, diagonal), diagonal.Times(1.5 * invSqrt2));
});

test("Left, Right, Up, Down, Zero, One are defined constants with the expected values", () => {
    compare(Vec2.Left , new Vec2(-1,  0));
    compare(Vec2.Right, new Vec2(+1,  0));
    compare(Vec2.Up   , new Vec2( 0, +1));
    compare(Vec2.Down , new Vec2( 0, -1));

    compare(Vec2.Zero , new Vec2( 0,  0));
    compare(Vec2.One  , new Vec2( 1,  1));

    compare(Vec2.X , new Vec2(+1,  0));
    compare(Vec2.Y , new Vec2( 0, +1));
});
