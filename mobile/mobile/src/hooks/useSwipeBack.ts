import { useEffect, useRef } from 'react';

const EDGE_THRESHOLD = 20; // px from left edge to start tracking
const SWIPE_DISTANCE = 80; // px needed to trigger back
const VELOCITY_THRESHOLD = 0.3; // px/ms

export function useSwipeBack(onBack: () => void, enabled: boolean) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (!enabled) return;

    let tracking = false;
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch.clientX <= EDGE_THRESHOLD) {
        tracking = true;
        startX = touch.clientX;
        startY = touch.clientY;
        startTime = Date.now();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = Math.abs(touch.clientY - startY);
      const dt = Date.now() - startTime;
      const velocity = dx / dt;

      // Must be mostly horizontal and meet distance + velocity thresholds
      if (dx > SWIPE_DISTANCE && velocity > VELOCITY_THRESHOLD && dx > dy) {
        onBackRef.current();
      }
    };

    const onTouchCancel = () => {
      tracking = false;
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('touchcancel', onTouchCancel, { passive: true });

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchCancel);
    };
  }, [enabled]);
}
