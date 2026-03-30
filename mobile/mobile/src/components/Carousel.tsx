import { useRef, useState, useEffect, useCallback, Children, type ReactNode } from 'react';

export function Carousel({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const count = Children.count(children);

  const checkIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild as HTMLElement | null;
    if (!firstCard) return;
    const cardWidth = firstCard.offsetWidth;
    const gap = 16;
    const index = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(index, count - 1));
  }, [count]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkIndex, { passive: true });
    return () => el.removeEventListener('scroll', checkIndex);
  }, [checkIndex]);

  return (
    <>
      <div className="acct-carousel acct-carousel--mobile">
        <div className="acct-carousel__track acct-carousel__track--mobile" ref={scrollRef}>
          {children}
        </div>
      </div>
      {count > 1 && (
        <div className="acct-carousel__dots">
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              className={`acct-carousel__dot${i === activeIndex ? ' acct-carousel__dot--active' : ''}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
