import { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

declare global {
  interface Window {
    html2canvas: typeof html2canvas;
    liquidGL: (options: Record<string, unknown>) => unknown;
    __liquidGLRenderer__?: { captureSnapshot?: () => void };
  }
}

// Make html2canvas available globally for liquidGL (must happen before liquidGL loads)
window.html2canvas = html2canvas;

let liquidGLLoaded = false;

async function ensureLiquidGL() {
  if (liquidGLLoaded) return;
  await import('../lib/liquidGL.js');
  liquidGLLoaded = true;
}

export function useLiquidGL<T extends HTMLElement = HTMLElement>(
  options: {
    refraction?: number;
    bevelDepth?: number;
    bevelWidth?: number;
    frost?: number;
    shadow?: boolean;
    specular?: boolean;
    tilt?: boolean;
  } = {}
) {
  const ref = useRef<T>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || initialized.current) return;

    const id = `liquidgl-${Math.random().toString(36).slice(2, 8)}`;
    el.setAttribute('data-liquidgl', id);

    let cancelled = false;

    ensureLiquidGL().then(() => {
      if (cancelled || !window.liquidGL) return;
      // Delay to let DOM paint before html2canvas snapshot
      setTimeout(() => {
        if (cancelled) return;
        window.liquidGL({
          target: `[data-liquidgl="${id}"]`,
          snapshot: 'body',
          refraction: options.refraction ?? 0.012,
          bevelDepth: options.bevelDepth ?? 0.06,
          bevelWidth: options.bevelWidth ?? 0.12,
          frost: options.frost ?? 0,
          shadow: options.shadow ?? true,
          specular: options.specular ?? true,
          tilt: options.tilt ?? false,
        });
        initialized.current = true;
      }, 500);
    });

    return () => { cancelled = true; };
  }, []);

  return ref;
}

/** Force liquidGL to re-capture the page snapshot (call after navigation) */
export function refreshLiquidGL() {
  const renderer = window.__liquidGLRenderer__;
  if (renderer?.captureSnapshot) {
    renderer.captureSnapshot();
  }
}
