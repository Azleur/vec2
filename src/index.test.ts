import { Vec2 } from './index';

test("constructor is plain and simple", () => {
    expect(thing(2)).toBe(false);
    expect(thing(3)).toBe(false);
    expect(thing(4)).toBe(true);
});
