import { useRef, useEffect } from 'react';
import { WebHaptics } from 'web-haptics';

let instance: WebHaptics | null = null;

function getHaptics(): WebHaptics {
  if (!instance) {
    instance = new WebHaptics();
  }
  return instance;
}

export function triggerHaptic(duration = 10) {
  getHaptics().trigger(duration);
}

export function useHapticOnChange(value: number | string) {
  const prevRef = useRef(value);
  useEffect(() => {
    if (prevRef.current !== value) {
      prevRef.current = value;
      triggerHaptic();
    }
  }, [value]);
}
