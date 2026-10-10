const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const script = fs.readFileSync(path.resolve(__dirname, '../static/js/scripts.js'), 'utf8');
const photos = ['lake.jpg', 'campus-sunset.jpg', 'city-sunset.jpg'];
const storage = new Map();

function load(storageDisabled = false) {
  let tick;
  const layers = Array.from({ length: 2 }, () => ({ style: {}, classList: { add() {}, remove() {} } }));
  const context = {
    console, Math: Object.create(Math),
    window: {
      addEventListener() {}, matchMedia: () => ({ matches: false }),
      setInterval(fn) { tick = fn; },
      localStorage: {
        getItem(key) { if (storageDisabled) throw Error('blocked'); return storage.get(key); },
        setItem(key, value) { if (storageDisabled) throw Error('blocked'); storage.set(key, value); },
      },
    },
    document: { querySelectorAll: () => layers, documentElement: { style: { setProperty() {} } } },
    HTMLAnchorElement: function () {},
  };
  vm.createContext(context);
  vm.runInContext(script, context);
  return { context, layers, tick: () => tick() };
}

// Every permutation is available on a first visit; prior first images are excluded.
const permutations = new Set();
for (const a of [0, .34, .67]) for (const b of [0, .51]) {
  const { context } = load();
  let values = [a, b];
  context.Math.random = () => values.shift() ?? 0;
  permutations.add(context.shuffleBackgrounds(photos).join(','));
}
assert.equal(permutations.size, 6);
for (const random of [0, .25, .5, .75, .99]) {
  const { context } = load();
  context.Math.random = () => random;
  for (const previous of photos) {
    const order = [...context.shuffleBackgrounds(photos, previous)];
    assert.deepEqual([...order].sort(), [...photos].sort());
    assert.notEqual(order[0], previous);
    assert.deepEqual(photos, ['lake.jpg', 'campus-sunset.jpg', 'city-sunset.jpg']);
  }
  assert.deepEqual([...context.shuffleBackgrounds([], 'lake.jpg')], []);
  assert.deepEqual([...context.shuffleBackgrounds(['lake.jpg'], 'lake.jpg')], ['lake.jpg']);
}

// Persistent visits differ even with identical random draws, and rounds have no repeats.
let previousFirst;
for (let visit = 0; visit < 10; visit++) {
  const app = load();
  app.context.Math.random = () => .5;
  app.context.initBackgroundSlideshow({ backgrounds: photos });
  const shown = [app.layers[0].style.backgroundImage];
  assert.notEqual(shown[0], previousFirst);
  previousFirst = shown[0];
  for (let step = 1; step < 12; step++) {
    app.tick();
    shown.push(app.layers[step % 2].style.backgroundImage);
    assert.notEqual(shown[step], shown[step - 1]);
  }
  for (let start = 0; start < shown.length; start += 3) {
    assert.equal(new Set(shown.slice(start, start + 3)).size, 3);
  }
}
const blocked = load(true);
assert.doesNotThrow(() => blocked.context.initBackgroundSlideshow({ backgrounds: photos }));
assert.ok(blocked.layers[0].style.backgroundImage);
console.log('background shuffle, persistence, cycle and storage fallback checks passed');
