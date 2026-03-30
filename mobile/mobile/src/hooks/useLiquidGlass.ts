import { useRef, useCallback, useEffect } from 'react';

const SPRING = 0.02;
const DAMP = 0.88;
const MAX_PULL = 12;
const STRETCH = 0.012;

export function useLiquidGlass<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const s = useRef({
    down: false,
    sx: 0, sy: 0,
    cx: 0, cy: 0,
    vx: 0, vy: 0,
    tx: 0, ty: 0,
    pressed: 0, vPressed: 0,
    raf: 0,
  });

  const tick = useCallback(() => {
    const st = s.current;
    const el = ref.current;
    if (!el) return;

    st.vx = (st.vx + (st.tx - st.cx) * SPRING) * DAMP;
    st.vy = (st.vy + (st.ty - st.cy) * SPRING) * DAMP;
    st.cx += st.vx;
    st.cy += st.vy;

    const tP = st.down ? 1 : 0;
    st.vPressed = (st.vPressed + (tP - st.pressed) * SPRING) * DAMP;
    st.pressed += st.vPressed;

    const absX = Math.abs(st.cx);
    const absY = Math.abs(st.cy);

    const pressScale = 1 + st.pressed * 0.06;
    const sx = (1 + absX * STRETCH) * pressScale;
    const sy = (1 + absY * STRETCH) * pressScale;

    const originX = st.cx > 0.5 ? '0%' : st.cx < -0.5 ? '100%' : '50%';
    const originY = st.cy > 0.5 ? '0%' : st.cy < -0.5 ? '100%' : '50%';
    el.style.transformOrigin = `${originX} ${originY}`;

    const moveX = st.cx * 0.35;
    const moveY = st.cy * 0.35;

    el.style.transform = `translate(${moveX}px, ${moveY}px) scale(${sx}, ${sy})`;

    // Pressed effects
    const p = st.pressed;
    const isAccent = el.classList.contains('ios-glass-btn--accent');
    const isCircle = el.classList.contains('ios-glass-btn--circle');

    if (isAccent) {
      // Subtle lighten — just brightness, keep the green
      el.style.filter = `brightness(${1 + p * 0.12})`;
    } else if (isCircle || el.classList.contains('ios-glass-btn--pill')) {
      // More see-through but brighten to keep white appearance
      el.style.background = `rgba(255, 255, 255, ${0.65 - p * 0.25})`;
      el.style.filter = `brightness(${1 + p * 0.15})`;
    }

    // Shadow softens and fades when pressed (circle keeps more shadow)
    const shadowBlur = 40 + p * 10;
    const shadowY = 8 - p * 4;
    const baseFade = isCircle ? 0.01 : 0.06;
    const shadowOpacity = 0.12 - p * baseFade;
    el.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity})`;

    const settled = !st.down
      && Math.abs(st.cx) < 0.08 && Math.abs(st.cy) < 0.08
      && Math.abs(st.vx) < 0.01 && Math.abs(st.vy) < 0.01
      && Math.abs(st.pressed) < 0.003;

    if (!settled) {
      st.raf = requestAnimationFrame(tick);
    } else {
      el.style.transform = '';
      el.style.transformOrigin = '';
      el.style.filter = '';
      el.style.opacity = '';
      el.style.background = '';
      el.style.boxShadow = '';
      st.cx = st.cy = st.vx = st.vy = 0;
      st.pressed = 0; st.vPressed = 0;
    }
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const st = s.current;
    st.down = true;
    st.sx = e.clientX;
    st.sy = e.clientY;
    st.tx = 0;
    st.ty = 0;
    cancelAnimationFrame(st.raf);
    st.raf = requestAnimationFrame(tick);
  }, [tick]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const st = s.current;
    if (!st.down) return;
    const rx = e.clientX - st.sx;
    const ry = e.clientY - st.sy;
    st.tx = Math.max(-MAX_PULL, Math.min(MAX_PULL, rx));
    st.ty = Math.max(-MAX_PULL, Math.min(MAX_PULL, ry));
  }, []);

  const onPointerUp = useCallback(() => {
    const st = s.current;
    st.down = false;
    st.tx = 0;
    st.ty = 0;
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(s.current.raf);
  }, []);

  return { ref, onPointerDown, onPointerMove, onPointerUp };
}
