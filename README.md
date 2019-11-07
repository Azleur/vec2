# 2D Vector class

`Vec2` is yet another 2D vector class.
It has a rich feature set for basic vector creation and manipulation.
It looks like this:

```typescript
const vec1 = new Vec2(1, 2); // vec1 = {x: 1, y: 2}
vec1.x = 3; // vec1 = {x: 3, y: 2}
const vec2 = vec1.Times(3); // vec2 = {x: 9, y: 6}
const vec3 = vec2.Sub(vec1); // vec3 = {x: 6, y: 4}
...

```

The code is a single TypeScript file with doc comments, so take a look for more details!
