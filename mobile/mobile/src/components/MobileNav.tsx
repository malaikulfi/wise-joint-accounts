import { useRef, useEffect, useLayoutEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { House, CardWise, Recipients, Payments } from '@transferwise/icons';
import { useLanguage } from '../context/Language';
import { useLiquidGL } from '../hooks/useLiquidGL';
import type { TranslationKey } from '../translations/en';

const items: { label: string; translationKey: TranslationKey; icon: React.ReactNode; href: string }[] = [
  { label: 'Home', translationKey: 'nav.home', icon: <House size={24} />, href: '/home' },
  { label: 'Cards', translationKey: 'nav.cards', icon: <CardWise size={24} />, href: '/cards' },
  { label: 'Recipients', translationKey: 'nav.recipients', icon: <Recipients size={24} />, href: '/recipients' },
  { label: 'Payments', translationKey: 'nav.payments', icon: <Payments size={24} />, href: '/account/payments' },
];

function NavItem({ label, translationKey, icon, active, onSelect }: {
  label: string;
  translationKey: TranslationKey;
  icon: React.ReactNode;
  active: boolean;
  onSelect: () => void;
}) {
  const { t } = useLanguage();

  return (
    <li className="mobile-nav-item">
      <button
        type="button"
        className={`mobile-nav-item__link${active ? ' mobile-nav-item__link--active' : ''}`}
        onClick={onSelect}
        aria-current={active ? 'page' : undefined}
      >
        <span className="mobile-nav-item__icon">{icon}</span>
        <span className="mobile-nav-item__label">{t(translationKey)}</span>
      </button>
    </li>
  );
}

export type MobileNavHandle = {
  animateTo: (label: string) => void;
};

export const MobileNav = forwardRef<MobileNavHandle, {
  activeItem: string;
  onSelect: (label: string) => void;
}>(function MobileNav({ activeItem, onSelect }, ref) {
  const navRef = useRef<HTMLElement>(null);
  const glassRef = useLiquidGL<HTMLDivElement>({
    frost: 0.85,
    refraction: 0.06,
    bevelDepth: 0.15,
    bevelWidth: 0.6,
    shadow: true,
    specular: true,
  });

  // Glass layer is now CSS-positioned (absolute, inset 0) inside the wrapper —
  // no JS size sync needed. The useLiquidGL hook just needs the ref attached.

  const highlightRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const animatingRef = useRef(false);

  // Position highlight on the current active item (no animation)
  const positionHighlight = useCallback(() => {
    const list = listRef.current;
    const highlight = highlightRef.current;
    if (!list || !highlight || animatingRef.current) return;
    const idx = items.findIndex((item) => item.label === activeItem);
    const el = list.children[idx] as HTMLElement | undefined;
    if (!el) return;
    highlight.style.transition = 'none';
    highlight.style.transform = `translateX(${el.offsetLeft}px)`;
    highlight.style.width = `${el.offsetWidth}px`;
  }, [activeItem]);

  useLayoutEffect(() => {
    positionHighlight();
    requestAnimationFrame(positionHighlight);
    // Fallback for environments where flex layout settles late (e.g. Make)
    const t = setTimeout(positionHighlight, 100);
    return () => clearTimeout(t);
  }, [positionHighlight]);

  // Reposition highlight when viewport resizes (device switch)
  useEffect(() => {
    const onResize = () => requestAnimationFrame(positionHighlight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [positionHighlight]);

  const handleSelect = useCallback((label: string) => {
    if (label === activeItem || animatingRef.current) return;

    const list = listRef.current;
    const highlight = highlightRef.current;
    const nav = navRef.current;
    if (!list || !highlight || !nav) return;

    const fromIdx = items.findIndex((item) => item.label === activeItem);
    const toIdx = items.findIndex((item) => item.label === label);
    const toEl = list.children[toIdx] as HTMLElement | undefined;
    if (!toEl) return;

    animatingRef.current = true;

    const targetX = toEl.offsetLeft;
    const targetW = toEl.offsetWidth;
    const navHeight = nav.offsetHeight;
    const extraWidth = 16;

    // Scale bounce on the whole nav wrapper (glass + bar together)
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
      wrapper.style.transform = 'scale(1.03)';
      setTimeout(() => {
        wrapper.style.transition = 'transform 0.25s cubic-bezier(0.0, 0, 0.2, 1)';
        wrapper.style.transform = 'scale(1)';
      }, 150);
    }

    // Phase 1: Go glassy at current size
    highlight.style.transition = 'none';
    highlight.classList.add('mobile-nav__highlight--glass');
    highlight.style.top = '0px';
    highlight.style.height = `${navHeight}px`;
    highlight.style.borderRadius = `${navHeight / 2}px`;

    // Force reflow
    highlight.offsetHeight;

    // Phase 2: Slide to new position + expand wider
    highlight.style.transition = 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1), width 0.38s cubic-bezier(0.4, 0, 0.2, 1)';
    highlight.style.width = `${targetW + extraWidth}px`;
    highlight.style.transform = `translateX(${targetX - extraWidth / 2}px)`;

    // Phase 3: Arrive — already expanded
    const onSlideEnd = () => {
      highlight.removeEventListener('transitionend', onSlideEnd);

      // Phase 4: Switch tab + shrink to grey
      const onExpandEnd = () => {
        highlight.removeEventListener('transitionend', onExpandEnd);

        // Switch tab now
        onSelect(label);

        // Shrink back to grey
        highlight.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
        highlight.classList.remove('mobile-nav__highlight--glass');
        highlight.style.top = '4px';
        highlight.style.height = '52px';
        highlight.style.borderRadius = '99px';
        highlight.style.transform = `translateX(${targetX}px)`;
        highlight.style.width = `${targetW}px`;

        const onShrinkEnd = () => {
          highlight.removeEventListener('transitionend', onShrinkEnd);
          highlight.style.transition = 'none';
          animatingRef.current = false;
        };
        highlight.addEventListener('transitionend', onShrinkEnd, { once: true });
      };
      highlight.addEventListener('transitionend', onExpandEnd, { once: true });
    };
    highlight.addEventListener('transitionend', onSlideEnd, { once: true });
  }, [activeItem, onSelect]);

  useImperativeHandle(ref, () => ({
    animateTo: (label: string) => handleSelect(label),
  }), [handleSelect]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mobile-nav__wrapper" ref={wrapperRef}>
      <div className="mobile-nav__glass" ref={glassRef} />
      <nav className="mobile-nav" ref={navRef}>
        <div className="mobile-nav__highlight" ref={highlightRef} />
        <ul className="mobile-nav__items" ref={listRef}>
          {items.map((item) => (
            <NavItem
              key={item.label}
              {...item}
              active={activeItem === item.label}
              onSelect={() => handleSelect(item.label)}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
});
