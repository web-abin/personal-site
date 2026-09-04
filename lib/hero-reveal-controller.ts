export type RevealElements = {
  root: HTMLElement;
  layer: HTMLElement;
  lens: HTMLElement;
  images: HTMLImageElement[];
  diameter: number;
  follow: number;
};

/** No React state or layout reads in pointermove. One shared geometry drives both layers. */
export function mountReveal({
  root,
  layer,
  lens,
  images,
  diameter,
  follow,
}: RevealElements) {
  const size = Number.isFinite(diameter) ? Math.max(1, diameter) : 260;
  const factor = Number.isFinite(follow)
    ? Math.min(1, Math.max(0.01, follow))
    : 0.12;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let rect = root.getBoundingClientRect();
  let dirty = false;
  let active = false;
  let disposed = false;
  let frame = 0;
  let lastTime = 0;
  let x = 0,
    y = 0,
    targetX = 0,
    targetY = 0,
    progress = 0;
  let ready = false;

  lens.style.width = `${size}px`;
  lens.style.height = `${size}px`;

  function paint() {
    const radius = size * 0.5 * progress;
    layer.style.setProperty('--mouse-x', `${x - rect.left}px`);
    layer.style.setProperty('--mouse-y', `${y - rect.top}px`);
    layer.style.setProperty('--reveal-radius', `${radius}px`);
    // With border-box, the cursor outer edge and mask radius are exactly coincident.
    lens.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${progress})`;
    lens.style.opacity = `${progress}`;
    // Clip the fixed border at the same section bounds without changing its circle size.
    lens.style.clipPath =
      progress > 0
        ? `inset(${Math.max(0, rect.top - (y - radius)) / progress}px ${Math.max(0, x + radius - rect.right) / progress}px ${Math.max(0, y + radius - rect.bottom) / progress}px ${Math.max(0, rect.left - (x - radius)) / progress}px)`
        : 'inset(0)';
  }

  function schedule() {
    if (!disposed && !frame) frame = requestAnimationFrame(tick);
  }
  function setActive(value: boolean) {
    active = value;
    root.dataset.revealActive = String(value);
  }
  function tick(time: number) {
    frame = 0;
    if (disposed) return;
    const dt = lastTime ? Math.min(64, time - lastTime) : 1000 / 60;
    lastTime = time;
    if (dirty) {
      rect = root.getBoundingClientRect();
      dirty = false;
      if (
        active &&
        (targetX < rect.left ||
          targetX > rect.right ||
          targetY < rect.top ||
          targetY > rect.bottom)
      )
        setActive(false);
    }
    const alpha = reduced.matches
      ? 1
      : 1 - Math.pow(1 - factor, dt / (1000 / 60));
    const growth = reduced.matches ? 1 : 1 - Math.pow(0.8, dt / (1000 / 60));
    x += (targetX - x) * alpha;
    y += (targetY - y) * alpha;
    const targetProgress = active ? 1 : 0;
    progress += (targetProgress - progress) * growth;
    const settled =
      Math.abs(targetX - x) < 0.05 &&
      Math.abs(targetY - y) < 0.05 &&
      Math.abs(targetProgress - progress) < 0.001;
    if (settled) {
      x = targetX;
      y = targetY;
      progress = targetProgress;
    }
    paint();
    // Rest/exit has zero idle RAF cost. New pointer/scroll events wake the loop.
    if (!settled) schedule();
    else lastTime = 0;
  }
  function track(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || !fine.matches || !ready) return;
    targetX = event.clientX;
    targetY = event.clientY;
    if (!active) {
      dirty = true;
      if (progress === 0) {
        x = targetX;
        y = targetY;
      }
      setActive(true);
    }
    schedule();
  }
  function leave() {
    setActive(false);
    schedule();
  }
  function reset() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    setActive(false);
    progress = 0;
    paint();
  }
  function geometryChanged() {
    dirty = true;
    if (active || progress > 0) schedule();
  }
  function preferencesChanged() {
    if (!fine.matches) reset();
    else if (active || progress > 0) schedule();
  }
  function visibilityChanged() {
    if (document.hidden) reset();
  }
  function loaded() {
    ready = images.every((img) => img.complete && img.naturalWidth > 0);
    root.dataset.revealReady = String(ready);
  }
  function failed() {
    ready = false;
    root.dataset.revealReady = 'false';
    reset();
  }

  paint();
  loaded();
  for (const img of images) {
    img.addEventListener('load', loaded);
    img.addEventListener('error', failed);
  }
  root.addEventListener('pointerenter', track, { passive: true });
  root.addEventListener('pointermove', track, { passive: true });
  root.addEventListener('pointerleave', leave, { passive: true });
  root.addEventListener('pointercancel', leave, { passive: true });
  window.addEventListener('scroll', geometryChanged, {
    passive: true,
    capture: true,
  });
  window.addEventListener('resize', geometryChanged, { passive: true });
  window.addEventListener('blur', reset);
  document.addEventListener('visibilitychange', visibilityChanged);
  fine.addEventListener('change', preferencesChanged);
  reduced.addEventListener('change', preferencesChanged);
  const observer = new ResizeObserver(geometryChanged);
  observer.observe(root);

  return () => {
    disposed = true;
    reset();
    observer.disconnect();
    for (const img of images) {
      img.removeEventListener('load', loaded);
      img.removeEventListener('error', failed);
    }
    root.removeEventListener('pointerenter', track);
    root.removeEventListener('pointermove', track);
    root.removeEventListener('pointerleave', leave);
    root.removeEventListener('pointercancel', leave);
    window.removeEventListener('scroll', geometryChanged, true);
    window.removeEventListener('resize', geometryChanged);
    window.removeEventListener('blur', reset);
    document.removeEventListener('visibilitychange', visibilityChanged);
    fine.removeEventListener('change', preferencesChanged);
    reduced.removeEventListener('change', preferencesChanged);
    delete root.dataset.revealActive;
    delete root.dataset.revealReady;
  };
}
