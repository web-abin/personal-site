import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mountReveal } from '../lib/hero-reveal-controller.ts';

class Element extends EventTarget {
  dataset = {};
  style = {
    setProperty(name, value) {
      this[name] = value;
    },
  };
  rect = {
    left: 100,
    top: 80,
    right: 1100,
    bottom: 780,
    width: 1000,
    height: 700,
  };
  reads = 0;
  getBoundingClientRect() {
    this.reads++;
    return { ...this.rect };
  }
}
function setup({ fine = true, reduced = false, loaded = true } = {}) {
  const raf = new Map();
  let id = 0,
    time = 0;
  const fineQuery = Object.assign(new EventTarget(), { matches: fine });
  const reducedQuery = Object.assign(new EventTarget(), { matches: reduced });
  globalThis.window = Object.assign(new EventTarget(), {
    matchMedia: (q) => (q.includes('reduced') ? reducedQuery : fineQuery),
  });
  globalThis.document = Object.assign(new EventTarget(), { hidden: false });
  globalThis.requestAnimationFrame = (fn) => {
    raf.set(++id, fn);
    return id;
  };
  globalThis.cancelAnimationFrame = (n) => raf.delete(n);
  let observer;
  globalThis.ResizeObserver = class {
    constructor(fn) {
      this.fn = fn;
      observer = this;
    }
    observe() {}
    disconnect() {
      this.disconnected = true;
    }
  };
  const root = new Element(),
    layer = new Element(),
    lens = new Element();
  const images = [new Element(), new Element()].map((img) =>
    Object.assign(img, { complete: loaded, naturalWidth: loaded ? 2000 : 0 }),
  );
  const dispose = mountReveal({
    root,
    layer,
    lens,
    images,
    diameter: 260,
    follow: 0.12,
  });
  const event = (type, x = 400, y = 300, pointerType = 'mouse') =>
    root.dispatchEvent(
      Object.assign(new Event(type), { clientX: x, clientY: y, pointerType }),
    );
  const step = (dt = 1000 / 60) => {
    time += dt;
    const pending = [...raf.values()];
    raf.clear();
    pending.forEach((fn) => fn(time));
  };
  const settle = () => {
    for (let i = 0; i < 200 && raf.size; i++) step();
    assert.equal(raf.size, 0);
  };
  return {
    root,
    layer,
    lens,
    raf,
    images,
    event,
    step,
    settle,
    dispose,
    fineQuery,
    reducedQuery,
    observer,
  };
}
const radius = (t) => parseFloat(t.layer.style['--reveal-radius']);

test('enter, inertial movement and fixed cursor share exact smooth coordinates', () => {
  const t = setup();
  t.event('pointerenter');
  t.step();
  assert.ok(radius(t) > 0 && radius(t) < 130);
  t.settle();
  assert.equal(radius(t), 130);
  const beforeReads = t.root.reads;
  t.event('pointermove', 800, 600);
  assert.equal(t.root.reads, beforeReads, 'pointermove must not read layout');
  t.step();
  const localX = parseFloat(t.layer.style['--mouse-x']);
  assert.ok(localX > 300 && localX < 700);
  assert.ok(
    t.lens.style.transform.startsWith(`translate3d(${localX + 100}px,`),
  );
  t.settle();
  assert.equal(t.layer.style['--mouse-x'], '700px');
  assert.equal(t.layer.style['--mouse-y'], '520px');
  t.dispose();
});
test('leave shrinks instead of hiding abruptly, then releases RAF', () => {
  const t = setup();
  t.event('pointerenter');
  t.settle();
  t.event('pointerleave');
  t.step();
  assert.ok(radius(t) > 0 && radius(t) < 130);
  assert.equal(t.root.dataset.revealActive, 'false');
  t.settle();
  assert.equal(radius(t), 0);
  assert.equal(t.lens.style.opacity, '0');
  t.dispose();
});
test('quick re-entry reverses shrinking without a full-size flash', () => {
  const t = setup();
  t.event('pointerenter');
  t.settle();
  t.event('pointerleave');
  t.step();
  const shrinking = radius(t);
  t.event('pointerenter', 450, 350);
  t.step();
  assert.ok(radius(t) > shrinking && radius(t) < 130);
  t.dispose();
});
test('reduced motion follows directly and enters/exits without interpolation', () => {
  const t = setup({ reduced: true });
  t.event('pointerenter');
  t.step();
  assert.equal(radius(t), 130);
  assert.equal(t.raf.size, 0);
  t.event('pointermove', 850, 600);
  t.step();
  assert.equal(t.layer.style['--mouse-x'], '750px');
  t.event('pointerleave');
  t.step();
  assert.equal(radius(t), 0);
  t.dispose();
});
test('touch pointers and coarse devices keep static base image', () => {
  const t = setup();
  t.event('pointerenter', 400, 300, 'touch');
  assert.equal(t.raf.size, 0);
  t.fineQuery.matches = false;
  t.event('pointerenter');
  assert.equal(t.raf.size, 0);
  t.dispose();
});
test('image loading gates the lens and image failure safely restores base', () => {
  const t = setup({ loaded: false });
  t.event('pointerenter');
  assert.equal(t.raf.size, 0);
  t.images.forEach((img) => {
    img.complete = true;
    img.naturalWidth = 2000;
    img.dispatchEvent(new Event('load'));
  });
  t.event('pointermove');
  t.settle();
  assert.equal(radius(t), 130);
  t.images[1].dispatchEvent(new Event('error'));
  assert.equal(radius(t), 0);
  assert.equal(t.raf.size, 0);
  t.dispose();
});
test('scroll and resize reconcile viewport cursor with local mask coordinates', () => {
  const t = setup();
  t.event('pointerenter');
  t.settle();
  t.root.rect.top = 20;
  t.root.rect.bottom = 720;
  window.dispatchEvent(new Event('scroll'));
  t.settle();
  assert.equal(t.layer.style['--mouse-y'], '280px');
  t.root.rect.left = 200;
  t.observer.fn();
  t.settle();
  assert.equal(t.layer.style['--mouse-x'], '200px');
  t.root.rect.bottom = 100;
  window.dispatchEvent(new Event('scroll'));
  t.settle();
  assert.equal(radius(t), 0);
  assert.equal(t.root.dataset.revealActive, 'false');
  t.dispose();
});
test('blur, device changes and cleanup leave no stale animation or cursor state', () => {
  const t = setup();
  t.event('pointerenter');
  t.settle();
  window.dispatchEvent(new Event('blur'));
  assert.equal(radius(t), 0);
  t.event('pointermove');
  t.settle();
  t.fineQuery.matches = false;
  t.fineQuery.dispatchEvent(new Event('change'));
  assert.equal(radius(t), 0);
  t.fineQuery.matches = true;
  t.event('pointermove');
  assert.equal(t.raf.size, 1);
  t.dispose();
  assert.equal(t.raf.size, 0);
  assert.equal(t.observer.disconnected, true);
  t.event('pointermove');
  window.dispatchEvent(new Event('scroll'));
  assert.equal(t.raf.size, 0);
  assert.equal(t.root.dataset.revealActive, undefined);
});
test('background tab cancels pending frames immediately', () => {
  const t = setup();
  t.event('pointerenter');
  t.step();
  document.hidden = true;
  document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(radius(t), 0);
  assert.equal(t.raf.size, 0);
  t.dispose();
});
