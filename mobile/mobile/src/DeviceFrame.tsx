import { useState, useEffect, useRef } from 'react';
import { Button } from '@transferwise/components';
import { ChevronDown, Check, Slider } from '@transferwise/icons';

type DeviceConfig = {
  label: string;
  frameW: number;
  frameH: number;
  screenW: number;
  screenH: number;
  screenX: number;
  screenY: number;
  frameImage: string;
  screenRadius?: number;
  hasNotch?: boolean;
};

const DEVICES: Record<string, DeviceConfig> = {
  'iphone-17-pro': {
    label: 'iPhone 17 Pro',
    frameW: 450, frameH: 920,
    screenW: 402, screenH: 874,
    screenX: 24, screenY: 23,
    frameImage: '/iphone17pro-frame.png',
  },
  'iphone-air': {
    label: 'iPhone Air',
    frameW: 460, frameH: 960,
    screenW: 420, screenH: 912,
    screenX: 20, screenY: 24,
    frameImage: '/iphoneair-frame.png',
  },
  'iphone-17-pro-max': {
    label: 'iPhone 17 Pro Max',
    frameW: 490, frameH: 1000,
    screenW: 440, screenH: 956,
    screenX: 25, screenY: 22,
    frameImage: '/iphone17promax-frame.png',
  },
  'iphone-x': {
    label: 'iPhone X',
    frameW: 429, frameH: 860,
    screenW: 375, screenH: 812,
    screenX: 27, screenY: 24,
    frameImage: '/iphonex-frame.png',
    screenRadius: 40,
    hasNotch: true,
  },
};

const DEVICE_KEYS = Object.keys(DEVICES);
const DEFAULT_DEVICE = 'iphone-17-pro';
const MOBILE_BREAKPOINT = 460;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export function isAppMode() {
  return new URLSearchParams(window.location.search).has('mode');
}

function useCurrentTime() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' });
  });
  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function StatusBar({ device }: { device: DeviceConfig }) {
  const time = useCurrentTime();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Listen for postMessage from iframe
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'theme-change') setDark(e.data.dark);
    };
    window.addEventListener('message', handler);

    // Also check iframe directly (for Make environment where postMessage may not work)
    const checkIframeDark = () => {
      const iframe = document.querySelector('.df-device-screen iframe') as HTMLIFrameElement;
      if (iframe?.contentDocument) {
        const isDark = iframe.contentDocument.documentElement.classList.contains('dark');
        setDark(isDark);
      }
    };

    checkIframeDark();
    const interval = setInterval(checkIframeDark, 500);

    return () => {
      window.removeEventListener('message', handler);
      clearInterval(interval);
    };
  }, []);

  const variantClass = device.hasNotch ? ' df-status-bar--notch' : '';

  return (
    <div
      className={`df-status-bar${dark ? ' df-status-bar--dark' : ''}${variantClass}`}
      style={{
        top: device.screenY,
        left: device.screenX,
        width: device.screenW,
      }}
    >
      <div className="df-status-bar__time">{time}</div>
      <div className="df-status-bar__island-spacer" />
      <div className="df-status-bar__icons">
        <img src="/cellular.svg" className="df-status-bar__cellular" alt="" />
        <img src="/wifi.svg" className="df-status-bar__wifi" alt="" />
        <img src="/battery.svg" className="df-status-bar__battery" alt="" />
      </div>
    </div>
  );
}

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'theme-change') setDark(e.data.dark);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);
  return dark;
}

export function DeviceFrame({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const isDevice = !isAppMode() && !isMobile;
  const [deviceKey, setDeviceKey] = useState(DEFAULT_DEVICE);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const device = DEVICES[deviceKey];
  const dark = useDarkMode();

  // Sync outer <html> dark class so Neptune Button gets dark styles
  useEffect(() => {
    document.documentElement.classList.toggle('np-theme-personal--dark', dark);
    return () => document.documentElement.classList.remove('np-theme-personal--dark');
  }, [dark]);

  useEffect(() => {
    if (!pickerOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [pickerOpen]);

  // Lock outer page scroll when device frame is active
  useEffect(() => {
    if (!isDevice) return;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isDevice]);

  if (!isDevice) {
    return <>{children}</>;
  }

  const currentPath = window.location.pathname;
  const iframeSrc = `${currentPath}?mode=app`;

  return (
    <div className={`df-wrap${dark ? ' df-wrap--dark' : ''}`}>
      <div className="df-picker" ref={pickerRef}>
        <Button
          v2
          size="sm"
          priority="primary"
          addonEnd={{ type: 'icon', value: (
            <span className={`df-picker__chevron${pickerOpen ? ' df-picker__chevron--open' : ''}`}>
              <ChevronDown size={16} />
            </span>
          )}}
          onClick={() => setPickerOpen(!pickerOpen)}
        >
          {device.label}
        </Button>
        {pickerOpen && (
          <div className="df-picker__panel">
            <div className="np-panel__content">
              <ul className="df-picker__dropdown">
                {DEVICE_KEYS.map((key) => (
                  <li key={key}>
                    <button
                      className="df-picker__dropdown-item"
                      onClick={() => { setDeviceKey(key); setPickerOpen(false); }}
                    >
                      <span>{DEVICES[key].label}</span>
                      {key === deviceKey && <Check size={16} />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="df-settings-btn">
        <Button
          v2
          size="sm"
          priority="primary"
          addonStart={{ type: 'icon', value: <Slider size={16} /> }}
          onClick={() => {
            iframeRef.current?.contentWindow?.postMessage({ type: 'open-settings' }, '*');
          }}
        >
          Settings
        </Button>
      </div>
      <div
        className="df-phone"
        style={{
          width: device.frameW * 0.85,
          height: device.frameH * 0.85,
        }}
      >
        <div className="df-phone__inner" style={{
          width: device.frameW,
          height: device.frameH,
          transform: 'scale(0.85)',
          transformOrigin: 'top left',
        }}>
        {/* Screen area */}
        <div
          className="df-screen-area"
          style={{
            top: device.screenY,
            left: device.screenX,
            width: device.screenW,
            height: device.screenH,
            borderRadius: device.screenRadius ?? 55,
          }}
        >
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            className="df-screen"
            style={{ width: device.screenW, height: device.screenH }}
            title="Mobile App Preview"
          />
        </div>
        {/* Device frame image overlay */}
        <img
          src={device.frameImage}
          className="df-frame-img"
          style={{ width: device.frameW, height: device.frameH }}
          alt=""
          draggable={false}
        />
        {/* iOS Status Bar — on top of frame */}
        <StatusBar device={device} />
        </div>
      </div>
    </div>
  );
}

export const DEVICE_CSS = `
/* ===== Prevent outer page scroll when device frame is active ===== */
html:has(.df-wrap), html:has(.df-wrap) body {
  overflow: hidden;
  height: 100%;
}

/* ===== Background — adapts to light/dark ===== */
.df-wrap {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background-screen);
  padding: 24px 20px;
  overflow: auto;
}

/* ===== Device Picker ===== */
.df-picker {
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 30;
}

/* ===== Settings Button ===== */
.df-settings-btn {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 30;
}

.df-picker__chevron {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.df-picker__chevron--open {
  transform: rotate(180deg);
}

.df-picker__panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 1000;
  animation: df-popout 0.15s ease-out;
}

.df-picker__panel .np-panel__content {
  opacity: 1;
  visibility: visible;
  transform: none;
  padding: 0;
  border-radius: 10px;
}

.df-picker__dropdown {
  list-style: none;
  margin: 0;
  padding: 8px;
  width: 200px;
}

.df-picker__dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 8px;
  color: var(--color-content-primary);
  font-family: Inter, -apple-system, system-ui, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  background: none;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
}

.df-picker__dropdown-item:hover {
  background: var(--color-background-neutral);
}

@keyframes df-popout {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* ===== Phone body — rendered at exact real-life size ===== */
.df-phone {
  position: relative;
  flex-shrink: 0;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.12)) drop-shadow(0 32px 64px rgba(0,0,0,0.18));
}

/* ===== Frame image overlay ===== */
.df-frame-img {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 10;
}

/* ===== Screen area ===== */
.df-screen-area {
  position: absolute;
  overflow: hidden;
  background: #fff;
}

/* ===== iframe ===== */
.df-screen {
  display: block;
  border: none;
}

/* ===== iOS Status Bar ===== */
.df-status-bar {
  position: absolute;
  height: 54px;
  z-index: 20;
  pointer-events: none;
  font-family: 'SF Pro Text', 'SF Pro Display', -apple-system, system-ui, sans-serif;
}

.df-status-bar__time {
  position: absolute;
  top: 23px;
  left: 6px;
  width: 138px;
  font-size: 17px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: -0.4px;
  color: #000;
  text-align: center;
}

.df-status-bar__icons {
  position: absolute;
  top: 26px;
  right: 37px;
  display: flex;
  align-items: center;
  gap: 7px;
}

.df-status-bar__cellular {
  width: 19.2px;
  height: 12.23px;
}

.df-status-bar__wifi {
  width: 17.14px;
  height: 12.33px;
}

.df-status-bar__battery {
  width: 27.33px;
  height: 13px;
}

/* Dark mode outer background */
.df-wrap--dark {
  background: #1a1a1a;
}

/* Dark mode screen area */
.df-wrap--dark .df-screen-area {
  background: #000;
}

/* Dark mode dropdown */
.df-wrap--dark .df-picker__panel .np-panel__content {
  background: #2a2a2a;
  border-color: rgba(255, 255, 255, 0.1);
}

.df-wrap--dark .df-picker__dropdown-item {
  color: #fff;
}

.df-wrap--dark .df-picker__dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* ===== Notch-style status bar (iPhone X) ===== */
.df-status-bar--notch .df-status-bar__time {
  top: 16px;
  left: 20px;
  width: 54px;
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
  text-align: center;
}

.df-status-bar--notch .df-status-bar__icons {
  top: 18px;
  right: 14px;
  gap: 4px;
}

.df-status-bar--notch .df-status-bar__cellular {
  width: 17px;
  height: 10.7px;
}

.df-status-bar--notch .df-status-bar__wifi {
  width: 15.3px;
  height: 11px;
}

.df-status-bar--notch .df-status-bar__battery {
  width: 24.3px;
  height: 11.5px;
}

.df-status-bar--notch .df-status-bar__island-spacer {
  display: none;
}

/* Dark mode status bar */
.df-status-bar--dark .df-status-bar__time {
  color: #fff;
}

.df-status-bar--dark .df-status-bar__icons img {
  filter: invert(1);
}
`;
