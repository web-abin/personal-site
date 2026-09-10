export const wrapPosition = (value: number, period: number) =>
  ((((value + period / 2) % period) + period) % period) - period / 2;
/** A continuous, concave image wall. Each tile gets its own tangent-plane rotation. */
export function projectTile(x: number, y: number, radius: number) {
  const u = x / radius,
    v = y / radius;
  return {
    x: radius * Math.sin(u) * Math.cos(v),
    y: radius * Math.sin(v),
    z: radius * (1 - Math.cos(u) * Math.cos(v)),
    rotateX: (v * 180) / Math.PI,
    rotateY: (-u * 180) / Math.PI,
  };
}

export function mountSpatialGallery(root: HTMLElement, entrance?: { progress: number }[]) {
  const world = root.querySelector<HTMLElement>('.spatial-world')!;
  const tiles = [...world.querySelectorAll<HTMLElement>('.spatial-tile')];
  const zoomPlane = root.querySelector<HTMLElement>('.spatial-zoom-plane')!;
  const crops = [...zoomPlane.querySelectorAll<HTMLElement>('.spatial-zoom-crop')];
  const coverImages = tiles.map(tile => tile.querySelector<HTMLImageElement>('img'));
  const coverUrls = coverImages.map(image => image?.src ?? '');
  let planar = false;
  let departing = false;
  let scrollProgress = 0, scrollX = 0, scrollY = 0;
  let hovered: HTMLElement | null = null;
  let pressed: HTMLElement | null = null;
  const hoverAmounts = tiles.map(() => 0);
  const coordinates = tiles.map(tile => ({ column: Number(tile.dataset.column), row: Number(tile.dataset.row) }));
  const written = tiles.map(() => ({ transform: '', opacity: '', visibility: '' }));
  let worldTransform = '';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0,
    height = 0,
    cell = 0,
    radius = 0,
    frame = 0,
    last = 0,
    dirty = true;
  let x = 0,
    y = 0,
    tx = 0,
    ty = 0,
    hold = 0,
    zoom = 0,
    tz = 0,
    flingX = 0,
    flingY = 0;
  let pointer: number | null = null,
    startX = 0,
    startY = 0,
    lastX = 0,
    lastY = 0,
    downTime = 0,
    moveTime = 0,
    vx = 0,
    vy = 0,
    moved = false,
    suppressClick = false;
  let disposed = false,
    visible = true;
  const queue = () => {
    if (!disposed && visible && !document.hidden && !frame) frame = requestAnimationFrame(tick);
  };
  function measure() {
    const rect = root.getBoundingClientRect();
    // Layout dimensions stay stable while ScrollTrigger scales the viewport.
    width = root.clientWidth || rect.width;
    height = root.clientHeight || rect.height;
    cell = Math.max(145, Math.min(330, width / 5.6));
    radius = Math.max(600, width * 0.78, height * 0.95);
    root.style.perspective = `${radius * 0.94}px`;
    root.style.setProperty('--wall-cell', `${cell - 24}px`);
    dirty = false;
  }
  function draw() {
    const nextWorldTransform = `translateZ(${-hold * 160 + zoom}px)`;
    if (worldTransform !== nextWorldTransform) world.style.transform = worldTransform = nextWorldTransform;
    const align = Math.min(1, scrollProgress * 5);
      const ox = scrollProgress ? scrollX + (cell / 2 - wrapPosition(scrollX, cell)) * align : x;
      const oy = scrollProgress ? scrollY + (cell / 2 - wrapPosition(scrollY, cell)) * align : y;
    const flatten = Math.min(1, scrollProgress * 3);
    const magnify = Math.pow(Math.max(width, height) / 20 + 2, scrollProgress);
    // Stop enlarging preserve-3d layers once the wall is flat. Render just the four
    // visible image crops in viewport-sized 2D boxes, never a giant GPU surface.
    const nextPlanar = flatten === 1;
    if (nextPlanar !== planar) {
      planar = nextPlanar;
      world.style.display = planar ? 'none' : '';
      zoomPlane.style.display = planar ? 'block' : 'none';
      if (!planar) written.forEach(item => { item.transform = item.opacity = item.visibility = ''; });
    }
    if (planar) {
      let slot = 0;
      coordinates.forEach((position, index) => {
        const px = wrapPosition(position.column * cell + ox, cell * 9);
        const py = wrapPosition(position.row * cell + oy, cell * 7);
        if (Math.abs(px) > cell * 0.51 || Math.abs(py) > cell * 0.51) return;
        const crop = crops[slot++];
        if (!crop) return;
        const size = (cell - 24) * magnify;
        const left = width / 2 + px * magnify - size / 2;
        const top = height * 0.42 + py * magnify - size / 2;
        const x0 = Math.max(0, left), y0 = Math.max(0, top);
        const w = Math.max(0, Math.min(width, left + size) - x0);
        const h = Math.max(0, Math.min(height, top + size) - y0);
        crop.style.display = w && h ? 'block' : 'none';
        if (!w || !h) return;
        crop.style.left = `${x0}px`;
        crop.style.top = `${y0}px`;
        crop.style.width = `${w}px`;
        crop.style.height = `${h}px`;
        crop.style.backgroundImage = `url("${coverUrls[index]}")`;
        // Match object-fit: cover when a project uses a non-square cover.
        const image = coverImages[index];
        const ratio = image?.naturalWidth && image.naturalHeight ? image.naturalWidth / image.naturalHeight : 1;
        const imageWidth = size * Math.max(1, ratio);
        const imageHeight = size * Math.max(1, 1 / ratio);
        crop.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;
        crop.style.backgroundPosition = `${left - x0 - (imageWidth - size) / 2}px ${top - y0 - (imageHeight - size) / 2}px`;
        const r = 7 * magnify;
        crop.style.borderRadius = `${left >= 0 && top >= 0 ? r : 0}px ${left + size <= width && top >= 0 ? r : 0}px ${left + size <= width && top + size <= height ? r : 0}px ${left >= 0 && top + size <= height ? r : 0}px`;
      });
      crops.slice(slot).forEach(crop => { crop.style.display = 'none'; });
      return;
    }
    tiles.forEach((tile, index) => {
      const px = wrapPosition(coordinates[index].column * cell + ox, cell * 9);
      const py = wrapPosition(coordinates[index].row * cell + oy, cell * 7);
      const p = projectTile(px, py, radius);
      // Flatten towards the four-card junction before the camera passes through its black gap.
      p.x = (p.x + (px - p.x) * flatten) * magnify;
      p.y = (p.y + (py - p.y) * flatten) * magnify;
      p.z *= 1 - flatten;
      p.rotateX *= 1 - flatten;
      p.rotateY *= 1 - flatten;
      const enter = entrance?.[index]?.progress ?? 1;
      const transform = `translate3d(${p.x * enter}px,${p.y * enter}px,${p.z * enter - 460 * (1 - enter)}px) rotateY(${p.rotateY * enter}deg) rotateX(${p.rotateX * enter}deg)`;
      const scale = (0.3 + 0.7 * enter) * magnify * (1 + hoverAmounts[index] * (1 - Math.min(1, scrollProgress * 8)));
      const nextTransform = scale !== 1 ? `${transform} scale(${scale})` : transform;
      // The DOM clip is outside the preserve-3d world, so depth is not flattened.
      const edge = Math.max(
        Math.abs(px) / (cell * 4.5),
        Math.abs(py) / (cell * 3.5),
      );
      // Fade before the wrapped seam or camera plane enters the visible hemisphere.
      const facing = Math.cos(px / radius) * Math.cos(py / radius);
      const alpha = Math.min(1, Math.max(0, (1 - edge) * 8), Math.max(0, (facing - 0.22) * 5));
      const nextOpacity = `${alpha * Math.min(1, enter * 2)}`;
      const offscreen = flatten === 1 && (
        Math.abs(p.x) - (cell - 24) * scale / 2 > width / 2 + 2 ||
        p.y - (cell - 24) * scale / 2 > height * 0.58 + 2 ||
        p.y + (cell - 24) * scale / 2 < -height * 0.42 - 2
      );
      const nextVisibility = alpha < 0.01 || offscreen ? 'hidden' : 'visible';
      const previous = written[index];
      if (nextVisibility === 'hidden') {
        if (previous.visibility !== nextVisibility) tile.style.visibility = previous.visibility = nextVisibility;
        return;
      }
      if (previous.transform !== nextTransform) tile.style.transform = previous.transform = nextTransform;
      if (previous.opacity !== nextOpacity) tile.style.opacity = previous.opacity = nextOpacity;
      if (previous.visibility !== nextVisibility) tile.style.visibility = previous.visibility = nextVisibility;
    });
  }
  function tick(time: number) {
    frame = 0;
    if (disposed) return;
    const dt = last ? Math.min(50, time - last) : 16.667;
    last = time;
    if (dirty) measure();
    // Integrate release velocity with time-based friction (px/ms), independent of refresh rate.
    if (pointer === null && !motion.matches) {
      const decay = Math.exp(-dt / 620);
      tx += flingX * 620 * (1 - decay);
      ty += flingY * 620 * (1 - decay);
      flingX *= decay;
      flingY *= decay;
      if (Math.hypot(flingX, flingY) < 0.008) flingX = flingY = 0;
    }
    const alpha = motion.matches
      ? 1
      : 1 - Math.pow(pointer !== null ? 0.74 : 0.9, dt / 16.667);
    const growth = motion.matches ? 1 : 1 - Math.pow(0.84, dt / 16.667);
    x += (tx - x) * alpha;
    y += (ty - y) * alpha;
    const targetHold = pointer !== null && moved && !motion.matches ? 1 : 0;
    hold += (targetHold - hold) * growth;
    zoom += (tz - zoom) * growth;
    let hovering = false;
    tiles.forEach((tile, index) => {
      const target = scrollProgress === 0 && !motion.matches
        ? pressed === tile && pointer !== null && !moved ? -0.035
          : hovered === tile && pointer === null ? 0.045 : 0
        : 0;
      hoverAmounts[index] += (target - hoverAmounts[index]) * growth;
      if (Math.abs(target - hoverAmounts[index]) < 0.0001) hoverAmounts[index] = target;
      else hovering = true;
    });
    const settled = !hovering &&
      flingX === 0 && flingY === 0 &&
      Math.abs(x - tx) + Math.abs(y - ty) < 0.04 &&
      Math.abs(targetHold - hold) < 0.001 &&
      Math.abs(zoom - tz) < 0.05;
    if (settled) {
      x = tx;
      y = ty;
      hold = targetHold;
      zoom = tz;
      last = 0;
    }
    draw();
    if (!settled) queue();
  }
  function down(e: PointerEvent) {
    if (scrollProgress > 0 || pointer !== null || e.button !== 0) return;
    pointer = e.pointerId;
    startX = lastX = e.clientX;
    startY = lastY = e.clientY;
    downTime = moveTime = performance.now();
    moved = false;
    pressed = (e.target as HTMLElement).closest?.<HTMLElement>('.spatial-tile') ?? null;
    suppressClick = false;
    vx = vy = flingX = flingY = 0;
    // Stop the old fling before beginning a new grab, without snapping to a card.
    tx = x;
    ty = y;
    root.dataset.grabbing = 'true';
    queue();
  }
  function move(e: PointerEvent) {
    if (e.pointerId !== pointer) return;
    const distance = Math.hypot(e.clientX - startX, e.clientY - startY);
    if (!moved && distance < 6) return;
    if (!moved) {
      moved = true;
      root.setPointerCapture(e.pointerId);
    }
    const now = performance.now(),
      dt = Math.max(8, now - moveTime);
    const dx = e.clientX - lastX,
      dy = e.clientY - lastY;
    const gain = 1.05 + hold * 0.12;
    tx += dx * gain;
    ty += dy * gain;
    const blend = 1 - Math.exp(-dt / 35);
    vx += (dx / dt - vx) * blend;
    vy += (dy / dt - vy) * blend;
    lastX = e.clientX;
    lastY = e.clientY;
    moveTime = now;
    e.preventDefault();
    queue();
  }
  function finish(e?: PointerEvent) {
    if (pointer === null || (e && e.pointerId !== pointer)) return;
    const id = pointer;
    pointer = null;
    pressed = null;
    const now = performance.now();
    suppressClick = moved || now - downTime > 280;
    if (
      moved &&
      e?.type === 'pointerup' &&
      !motion.matches &&
      now - moveTime < 120
    ) {
      const freshness = Math.exp(-(now - moveTime) / 100);
      const speed = Math.hypot(vx, vy);
      const gain = Math.min(1.35, 2.6 / Math.max(speed, 0.001)) * freshness;
      flingX = vx * gain;
      flingY = vy * gain;
    }
    vx = vy = 0;
    delete root.dataset.grabbing;
    if (root.hasPointerCapture(id)) root.releasePointerCapture(id);
    queue();
  }
  function click(e: MouseEvent) {
    if (suppressClick) {
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
    }
  }
  function wheel(e: WheelEvent) {
    // Keep ordinary vertical page scrolling available. Horizontal trackpad motion pans the wall.
    if (e.ctrlKey || scrollProgress > 0) return;
    if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      tx -= e.shiftKey ? e.deltaY : e.deltaX;
      queue();
    }
  }
  function reset() {
    finish();
    flingX = flingY = 0;
    tx = ty = tz = 0;
    queue();
  }
  function key(e: KeyboardEvent) {
    if (scrollProgress > 0) return;
    const map: Record<string, [number, number]> = {
      ArrowLeft: [cell, 0],
      ArrowRight: [-cell, 0],
      ArrowUp: [0, cell],
      ArrowDown: [0, -cell],
    };
    if (map[e.key]) {
      e.preventDefault();
      tx += map[e.key][0];
      ty += map[e.key][1];
      queue();
    }
    if (e.key === 'Home') {
      e.preventDefault();
      reset();
    }
  }
  function resize() {
    dirty = true;
    queue();
  }
  function blur() {
    finish();
    flingX = flingY = 0;
    tx = x;
    ty = y;
    queue();
  }
  function preferences() {
    flingX = flingY = 0;
    tx = x;
    ty = y;
    queue();
  }
  function visibility() {
    if (document.hidden) {
      blur();
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    } else queue();
  }
  function hover(e: PointerEvent) {
    if (e.pointerType === 'touch') return;
    hovered = (e.target as Element).closest<HTMLElement>('.spatial-tile');
    queue();
  }
  function leave() { hovered = null; queue(); }
  function scrollScene(e: Event) {
    if (departing) return;
    const raw = Math.max(0, Math.min(1, (e as CustomEvent<number>).detail));
    const progress = raw < 0.0001 ? 0 : raw > 0.9999 ? 1 : raw;
    if (progress > 0 && scrollProgress === 0) {
      finish();
      flingX = flingY = 0;
      scrollX = tx = x;
      scrollY = ty = y;
      hovered = null;
    }
    if (progress === 0 && scrollProgress > 0) {
      x = tx = scrollX;
      y = ty = scrollY;
      hold = zoom = tz = 0;
      flingX = flingY = 0;
      hoverAmounts.fill(0);
    }
    scrollProgress = motion.matches ? 0 : progress;
    queue();
  }
  root.addEventListener('pointerover', hover);
  root.addEventListener('pointerleave', leave);
  root.addEventListener('gallery-scroll', scrollScene);
  function preventDrag(e: Event) {
    e.preventDefault();
  }
  root.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move, { passive: false });
  window.addEventListener('pointerup', finish);
  window.addEventListener('pointercancel', finish);
  root.addEventListener('lostpointercapture', finish);
  root.addEventListener('click', click, true);
  root.addEventListener('dragstart', preventDrag);
  root.addEventListener('wheel', wheel, { passive: false });
  root.addEventListener('keydown', key);
  window.addEventListener('blur', blur);
  document.addEventListener('visibilitychange', visibility);
  motion.addEventListener('change', preferences);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(root);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) queue();
    else {
      finish();
      flingX = flingY = 0;
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    }
  });
  observer.observe(root);
  // Establish geometry before revealing the SSR-hidden world.
  measure();
  draw();
  world.style.visibility = 'visible';
  queue();
  return {
    reset,
    beginDeparture() {
      departing = true;
      finish();
      flingX = flingY = 0;
      hovered = null;
      hoverAmounts.fill(0);
      scrollProgress = 0;
      hold = zoom = tz = 0;
      queue();
    },
    cancelDeparture() { departing = false; queue(); },
    renderEntrance() {
      queue();
    },
    dispose() {
      disposed = true;
      finish();
      flingX = flingY = 0;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      root.removeEventListener('pointerover', hover);
      root.removeEventListener('pointerleave', leave);
      root.removeEventListener('gallery-scroll', scrollScene);
      root.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
      root.removeEventListener('lostpointercapture', finish);
      root.removeEventListener('click', click, true);
      root.removeEventListener('dragstart', preventDrag);
      root.removeEventListener('wheel', wheel);
      root.removeEventListener('keydown', key);
      window.removeEventListener('blur', blur);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', preferences);
    },
  };
}
