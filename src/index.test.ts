import { Vec2, FromPolar, Interpolate, Average } from './index';

// Handy helpers!
const compare = (a: Vec2, b: any) => {
    expect(a.x).toBeCloseTo(b.x);
    expect(a.y).toBeCloseTo(b.y);
}
const Pi = Math.PI;

test("constructor takes parameters (x: number, y: number), which correspond to respective fields", () => {
    const v1 = new Vec2(0, 0);
    const v2 = new Vec2(1, 0);
    const v3 = new Vec2(0, 1);
    const v4 = new Vec2(1, 1);
    const v5 = new Vec2(-2, 3.5);

    expect(v1).toEqual({ x: 0, y: 0 });
    expect(v2).toEqual({ x: 1, y: 0 });
    expect(v3).toEqual({ x: 0, y: 1 });
    expect(v4).toEqual({ x: 1, y: 1 });
    expect(v5).toEqual({ x: -2, y: 3.5 });
});

test("Vec2.Add(Vec2): Vec2 returns a new sum vector without modifying the originals.", () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, -4);

    const out1 = v1.Add(v2);
    expect(out1).toEqual({ x: 4, y: -2 });
    expect(v1).toEqual({ x: 1, y: 2 }); // v1 not modified.
    expect(v2).toEqual({ x: 3, y: -4 }); // v2 not modified.

    const out2 = v2.Add(v1);
    expect(out2).toEqual(out1); // Commutativity applies.

    const out3 = v1.Add(v1);
    expect(out3).toEqual({ x: 2, y: 4 });

    const out4 = v2.Add(v2);
    expect(out4).toEqual({ x: 6, y: -8 });
});

test("Vec2.Sub(Vec2): Vec2 returns a new subtraction vector without modifying the originals.", () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, -4);
    const zero = new Vec2(0, 0);

    const out1 = v1.Sub(v2);
    expect(out1).toEqual({ x: -2, y: 6 });
    expect(v1).toEqual({ x: 1, y: 2 }); // v1 not modified.
    expect(v2).toEqual({ x: 3, y: -4 }); // v2 not modified.

    const out2 = v2.Sub(v1);
    expect(out2).toEqual({ x: 2, y: -6 }); // Sign changes on order change.

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
    expect(v1).toEqual({ x: 1, y: 2 }); // v1 not modified.
    expect(v2).toEqual({ x: 3, y: -4 }); // v2 not modified.

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
    expect(v1).toEqual({ x: 1, y: 2 }); // Not modified.

    const out2 = v1.Cross(v2);
    expect(out2).toBe(5); // Perpendicular vectors get full modulus.
    expect(v2).toEqual({ x: -2, y: 1 }); // Not modified.
});

test("Vec2.Times(number): Vec2 returns a new scaled vector without modifying the original.", () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, -4);
    const zero = new Vec2(0, 0);

    const out1 = v1.Times(2);
    expect(out1).toEqual({ x: 2, y: 4 });
    expect(v1).toEqual({ x: 1, y: 2 }); // v1 not modified.

    const out2 = v2.Times(2);
    expect(out2).toEqual({ x: 6, y: -8 });
    expect(v2).toEqual({ x: 3, y: -4 }); // v2 not modified.

    const out3 = v1.Times(1);
    expect(out3).toEqual(v1); // Identity.

    const out4 = v1.Times(0);
    expect(out4).toEqual(zero); // Zero.
});

test("Vec2.Div(number): Vec2 returns a new scaled vector without modifying the original.", () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, -4);

    const out1 = v1.Div(2);
    expect(out1).toEqual({ x: 0.5, y: 1 });
    expect(v1).toEqual({ x: 1, y: 2 }); // v1 not modified.

    const out2 = v2.Div(2);
    expect(out2).toEqual({ x: 1.5, y: -2 });
    expect(v2).toEqual({ x: 3, y: -4 }); // v2 not modified.

    const out3 = v1.Div(1);
    expect(out3).toEqual(v1); // Identity.
});

test("Vec2.Negate(): Vec2 returns a new negated vector without modifying the original.", () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, -4);

    const out1 = v1.Negate();
    expect(out1).toEqual({ x: -1, y: -2 });
    expect(v1).toEqual({ x: 1, y: 2 }); // v1 not modified.

    const out2 = v2.Negate();
    expect(out2).toEqual({ x: -3, y: 4 });
    expect(v2).toEqual({ x: 3, y: -4 }); // v2 not modified.
});

test("Vec2.MagSqr(): number returns the square magnitude of a vector, without modifying the original.", () => {
    const v1 = new Vec2(1, 0);
    const v2 = new Vec2(3, -4);
    const zero = new Vec2(0, 0);
    const one = new Vec2(1, 1);

    expect(v1.MagSqr()).toBe(1);
    expect(v1).toEqual({ x: 1, y: 0 }); // v1 not modified.

    expect(v2.MagSqr()).toBe(25);
    expect(v2).toEqual({ x: 3, y: -4 }); // v2 not modified.

    expect(zero.MagSqr()).toBe(0);
    expect(zero).toEqual({ x: 0, y: 0 }); // zero not modified.

    expect(one.MagSqr()).toBe(2);
    expect(one).toEqual({ x: 1, y: 1 }); // one not modified.
});

test("Vec2.MagSqr(): number returns the magnitude of a vector, without modifying the original.", () => {
    const v1 = new Vec2(1, 0);
    const v2 = new Vec2(3, -4);
    const zero = new Vec2(0, 0);
    const one = new Vec2(1, 1);

    expect(v1.Mag()).toBeCloseTo(1);
    expect(v1).toEqual({ x: 1, y: 0 }); // v1 not modified.

    expect(v2.Mag()).toBeCloseTo(5);
    expect(v2).toEqual({ x: 3, y: -4 }); // v2 not modified.

    expect(zero.Mag()).toBeCloseTo(0);
    expect(zero).toEqual({ x: 0, y: 0 }); // zero not modified.

    expect(one.Mag()).toBeCloseTo(Math.sqrt(2));
    expect(one).toEqual({ x: 1, y: 1 }); // one not modified.
});

test("Vec2.Normalized(): Vec2 returns a normalized copy of a vector, without modifying the original.", () => {
    const v1 = new Vec2(1, 0);
    const v2 = new Vec2(3, -4);
    const one = new Vec2(1, 1);

    compare(v1.Normalized(), { x: 1, y: 0 });
    expect(v1).toEqual({ x: 1, y: 0 }); // v1 not modified.

    compare(v2.Normalized(), { x: 3 / 5, y: -4 / 5 });
    expect(v2).toEqual({ x: 3, y: -4 }); // v2 not modified.

    compare(one.Normalized(), { x: Math.sqrt(0.5), y: Math.sqrt(0.5) });
    expect(one).toEqual({ x: 1, y: 1 }); // one not modified.
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

test("FromPolar(number, number) returns the Vec2 corresponding to the polar representation (radius, angle).", () => {
    // Radius degeneracy
    compare(FromPolar(0, 0.0 * Pi), { x: 0, y: 0 });
    compare(FromPolar(0, 0.5 * Pi), { x: 0, y: 0 });
    compare(FromPolar(0, 1.0 * Pi), { x: 0, y: 0 });

    // Axes
    compare(FromPolar(1, 0.0 * Pi), { x: 1, y: 0 });
    compare(FromPolar(1, 0.5 * Pi), { x: 0, y: 1 });
    compare(FromPolar(1, 1.0 * Pi), { x: -1, y: 0 });
    compare(FromPolar(1, 1.5 * Pi), { x: 0, y: -1 });

    // 2-Pi excess does not matter.
    compare(FromPolar(1, 0.0 * Pi), { x: 1, y: 0 });
    compare(FromPolar(1, 2.0 * Pi), { x: 1, y: 0 });
    compare(FromPolar(1, -2.0 * Pi), { x: 1, y: 0 });
    compare(FromPolar(1, 4.0 * Pi), { x: 1, y: 0 });

    // Scaling works as expected.
    compare(FromPolar(1 * Math.sqrt(2), 0.25 * Pi), { x: 1, y: 1 });
    compare(FromPolar(2 * Math.sqrt(2), 0.25 * Pi), { x: 2, y: 2 });
    compare(FromPolar(3 * Math.sqrt(2), 0.25 * Pi), { x: 3, y: 3 });
});

test("Interpolate(Vec2, Vec2, number): Vec2 returns the unclamped linear interpolation of two vectors", () => {
    const vec1 = new Vec2(0, 0);
    const vec2 = new Vec2(1, 1);
    const vec3 = new Vec2(2, 3);
    const vec4 = new Vec2(-5, 4);

    compare(Interpolate(vec1, vec2, 0), vec1); // t=0 => a.
    compare(Interpolate(vec1, vec2, 1), vec2); // t=1 => b.
    compare(Interpolate(vec1, vec2, 0.5), { x: 0.5, y: 0.5 }); // t=1/2 => midpoint.
    compare(Interpolate(vec1, vec2, -1), { x: -1, y: -1 }); // Unclamped.
    compare(Interpolate(vec1, vec2, 2), { x: 2, y: 2 }); // Unclamped.

    compare(Interpolate(vec3, vec4, 0), vec3); // t=0 => a.
    compare(Interpolate(vec3, vec4, 1), vec4); // t=1 => b.
    compare(Interpolate(vec3, vec4, 0.5), { x: -1.5, y: 3.5 }); // t=1/2 => midpoint.
    compare(Interpolate(vec3, vec4, -1), { x: 9, y: 2 }); // Unclamped.
    compare(Interpolate(vec3, vec4, 2), { x: -12, y: 5 }); // Unclamped.
});

test("Average(...Vec2): Vec2 calculates the arithmetic mean of a sequence of vectors", () => {
    const vec1 = new Vec2(0, 0);
    const vec2 = new Vec2(1, 1);
    const vec3 = new Vec2(2, 3);
    const vec4 = new Vec2(-5, 4);

    compare(Average(), { x: 0, y: 0 }); // No vectors => zero element.
    compare(Average(vec1), vec1); // One vector => itself.
    compare(Average(vec1, vec2), { x: 0.5, y: 0.5 }); // Two vectors => midpoint.

    compare(Average(vec3), vec3); // One vector => itself.
    compare(Average(vec3, vec4), { x: -1.5, y: 3.5 }); // Two vectors => midpoint.

    compare(Average(vec1, vec2, vec3), { x: 1, y: 4 / 3 });
    compare(Average(vec1, vec2, vec3, vec4), { x: -0.5, y: 2 });
});
