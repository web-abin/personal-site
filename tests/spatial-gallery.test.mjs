import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mountSpatialGallery,
  projectTile,
  wrapPosition,
} from '../lib/spatial-gallery-controller.ts';
class Element extends EventTarget {
  style = {
    setProperty(k, v) {
      this[k] = v;
    },
  };
  dataset = {};
  capture = null;
  querySelector() { return null; }
  getBoundingClientRect() {
    return { width: 1400, height: 780 };
  }
  setPointerCapture(id) {
    this.capture = id;
  }
  hasPointerCapture(id) {
    return this.capture === id;
  }
  releasePointerCapture() {
    this.capture = null;
  }
}
function fixture(entrance, position = { column: '0', row: '0' }) {
  let now = 0,
    id = 0;
  const frames = new Map();
  globalThis.performance = { now: () => now };
  globalThis.window = new EventTarget();
  globalThis.document = Object.assign(new EventTarget(), { hidden: false });
  const media = Object.assign(new EventTarget(), { matches: false });
  globalThis.matchMedia = () => media;
  globalThis.requestAnimationFrame = (fn) => {
    frames.set(++id, fn);
    return id;
  };
  globalThis.cancelAnimationFrame = (id) => frames.delete(id);
  globalThis.ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
  let intersection;
  globalThis.IntersectionObserver = class {
    constructor(callback) { intersection = callback; }
    observe() {}
    disconnect() {}
  };
  const root = new Element(),
    world = new Element(),
    tile = new Element();
  tile.dataset = position;
  const zoomPlane = new Element();
  const crops = Array.from({ length: 4 }, () => new Element());
  zoomPlane.querySelectorAll = () => crops;
  root.querySelector = (selector) => selector === '.spatial-world' ? world : zoomPlane;
  world.querySelectorAll = () => [tile];
  const c = mountSpatialGallery(root, entrance);
  const step = () => {
    now += 16.667;
    const f = [...frames.values()];
    frames.clear();
    f.forEach((fn) => fn(now));
  };
  const settle = () => {
    for (let i = 0; i < 400 && frames.size; i++) step();
    assert.equal(frames.size, 0);
  };
  const pointer = (type, x = 0, y = 0) => {
    const e = Object.assign(new Event(type, { cancelable: true }), {
      pointerId: 1,
      button: 0,
      clientX: x,
      clientY: y,
    });
    (type === 'pointerdown' ? root : window).dispatchEvent(e);
    return e;
  };
  settle();
  return {
    root,
    world,
    zoomPlane,
    crops,
    tile,
    c,
    pointer,
    step,
    settle,
    frames,
    media,
    setVisible: (isIntersecting) => intersection([{ isIntersecting }]),
    advance: (ms) => (now += ms),
  };
}
test('surface bends in both axes and wraps after arbitrarily long drags', () => {
  const a = projectTile(300, 200, 1000);
  assert.ok(a.z > 0 && a.rotateX > 0 && a.rotateY < 0);
  assert.equal(projectTile(0, 0, 1000).z, 0);
  for (const x of [-999999, -201, 0, 201, 999999]) {
    const v = wrapPosition(x, 400);
    assert.ok(v >= -200 && v < 200);
    assert.equal(wrapPosition(x + 400, 400), v);
  }
});
test('held press retreats the wall, diagonal drag changes both spatial coordinates', () => {
  const f = fixture();
  f.pointer('pointerdown', 100, 100);
  f.settle();
  assert.equal(f.world.style.transform, 'translateZ(-160px)');
  f.pointer('pointermove', 250, 230);
  f.step();
  assert.equal(f.root.capture, 1);
  assert.match(f.tile.style.transform, /rotateY\(-/);
  assert.doesNotMatch(f.tile.style.transform, /rotateX\(0deg\)/);
  const before = f.tile.style.transform;
  f.pointer('pointerup', 250, 230);
  f.settle();
  assert.notEqual(f.tile.style.transform, before);
  assert.equal(f.world.style.transform, 'translateZ(0px)');
  f.c.dispose();
});
test('short click remains a link; drag and long hold suppress navigation', () => {
  const f = fixture();
  f.pointer('pointerdown');
  f.advance(80);
  f.pointer('pointerup');
  let click = new Event('click', { cancelable: true });
  f.root.dispatchEvent(click);
  assert.equal(click.defaultPrevented, false);
  f.pointer('pointerdown');
  f.pointer('pointermove', 90, 80);
  f.pointer('pointerup');
  click = new Event('click', { cancelable: true });
  f.root.dispatchEvent(click);
  assert.equal(click.defaultPrevented, true);
  f.pointer('pointerdown');
  f.advance(400);
  f.pointer('pointerup');
  click = new Event('click', { cancelable: true });
  f.root.dispatchEvent(click);
  assert.equal(click.defaultPrevented, true);
  f.c.dispose();
});
test('reset recenters and releases capture; disposal removes handlers and frames', () => {
  const f = fixture();
  f.pointer('pointerdown');
  f.pointer('pointermove', 200, 150);
  f.settle();
  f.c.reset();
  f.settle();
  const coords = f.tile.style.transform
    .match(/translate3d\(([^)]+)\)/)[1]
    .split(',')
    .map(parseFloat);
  assert.ok(coords.every((n) => Math.abs(n) < 1e-8));
  assert.equal(f.root.capture, null);
  f.pointer('pointerdown');
  f.c.dispose();
  assert.equal(f.frames.size, 0);
  f.pointer('pointermove', 200, 200);
  assert.equal(f.frames.size, 0);
});
test('reduced motion disables hold animation and inertia while retaining two-axis input', () => {
  const f = fixture();
  f.media.matches = true;
  f.pointer('pointerdown');
  f.settle();
  assert.equal(f.world.style.transform, 'translateZ(0px)');
  f.pointer('pointermove', 180, 120);
  f.step();
  assert.equal(f.frames.size, 0);
  const before = f.tile.style.transform;
  f.pointer('pointerup');
  f.settle();
  assert.equal(f.tile.style.transform, before);
  f.c.dispose();
});
test('normal vertical wheel scroll is not intercepted', () => {
  const f = fixture();
  const e = Object.assign(new Event('wheel', { cancelable: true }), {
    deltaX: 0,
    deltaY: 150,
    ctrlKey: false,
    shiftKey: false,
  });
  f.root.dispatchEvent(e);
  assert.equal(e.defaultPrevented, false);
  f.c.dispose();
});

test('release keeps gliding after half a second and a new grab stops the fling', () => {
  const f = fixture();
  f.pointer('pointerdown', 100, 100);
  for (let i = 1; i <= 5; i++) {
    f.advance(20);
    f.pointer('pointermove', 100 + i * 20, 100);
    f.step();
  }
  f.pointer('pointerup', 200, 100);
  for (let i = 0; i < 36; i++) f.step();
  const afterHalfSecond = f.tile.style.transform;
  assert.ok(f.frames.size > 0, 'inertia should still be running');
  for (let i = 0; i < 12; i++) f.step();
  assert.notEqual(f.tile.style.transform, afterHalfSecond);
  f.pointer('pointerdown', 200, 100);
  const grabbed = f.tile.style.transform;
  f.settle();
  assert.equal(f.tile.style.transform, grabbed, 'new grab cancels momentum without moving the wall');
  f.c.dispose();
});

 test('entrance starts invisible at the center and settles on the interactive sphere', () => {
  const entrance = [{ progress: 0 }];
  const f = fixture(entrance, { column: '2', row: '1' });
  f.c.renderEntrance();
  f.step();
  assert.equal(f.tile.style.opacity, '0');
  assert.match(f.tile.style.transform, /translate3d\(0px,0px,-460px\)/);
  entrance[0].progress = 0.5;
  f.c.renderEntrance();
  f.step();
  assert.ok(Number(f.tile.style.opacity) > 0);
  const middle = f.tile.style.transform;
  entrance[0].progress = 1;
  f.c.renderEntrance();
  f.step();
  assert.notEqual(f.tile.style.transform, middle);
  assert.doesNotMatch(f.tile.style.transform, /scale\(/);
  f.c.dispose();
});

test('scroll zoom clears the screen through a card gap and reverses to the original wall', () => {
  const f = fixture();
  const original = f.tile.style.transform;
  const scroll = (detail) => { f.root.dispatchEvent(Object.assign(new Event('gallery-scroll'), { detail })); f.step(); };
  scroll(0.25);
  assert.match(f.tile.style.transform, /scale\(/);
  scroll(1);
  assert.equal(f.world.style.display, 'none');
  assert.ok(f.crops.every(crop => crop.style.display === 'none'));
  scroll(0);
  assert.equal(f.tile.style.transform, original);
  assert.equal(f.tile.style.visibility, 'visible');
  f.c.dispose();
});

test('hover subtly grows only the focused card and restores on leave', () => {
  const f = fixture();
  f.root.closest = () => f.tile;
  f.root.dispatchEvent(new Event('pointerover'));
  f.settle();
  const scale = () => Number(f.tile.style.transform.match(/scale\(([^)]+)\)/)?.[1] ?? 1);
  const focused = scale();
  assert.ok(focused > 1.04 && focused < 1.05);
  f.root.closest = () => ({ dataset: { column: '1', row: '0' } });
  f.root.dispatchEvent(new Event('pointerover'));
  f.settle();
  assert.equal(scale(), 1);
  f.root.dispatchEvent(new Event('pointerleave'));
  f.settle();
  assert.equal(scale(), 1);
  f.c.dispose();
});


test('tiny reverse progress fully restores the dragged view and enables grabbing', () => {
  const f = fixture();
  f.pointer('pointerdown');
  f.pointer('pointermove', 170, 80);
  f.advance(200);
  f.pointer('pointerup');
  f.settle();
  const original = f.tile.style.transform;
  for (let cycle = 0; cycle < 3; cycle++) {
    for (const detail of [0.5, 1, 0.7, 0.000001]) {
      f.root.dispatchEvent(Object.assign(new Event('gallery-scroll'), { detail }));
      f.settle();
    }
    assert.equal(f.tile.style.transform, original);
    f.pointer('pointerdown');
    assert.equal(f.root.dataset.grabbing, 'true');
    f.pointer('pointerup');
    f.settle();
  }
  f.c.dispose();
});

test('updates share one frame, stop offscreen, and restore the latest state on reentry', () => {
  const f = fixture();
  for (let i = 0; i < 20; i++) f.c.renderEntrance();
  assert.equal(f.frames.size, 1);
  f.settle();
  assert.equal(f.frames.size, 0);
  f.setVisible(false);
  for (const detail of [0.5, 1, 0]) {
    f.root.dispatchEvent(Object.assign(new Event('gallery-scroll'), { detail }));
    f.c.renderEntrance();
  }
  assert.equal(f.frames.size, 0);
  f.setVisible(true);
  f.settle();
  assert.equal(f.tile.style.visibility, 'visible');
  assert.doesNotMatch(f.tile.style.transform, /scale\(/);
  f.c.dispose();
});
