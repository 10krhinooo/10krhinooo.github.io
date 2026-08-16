import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface RevealProps {
  children: ReactNode;
  /** Stagger position within a group, in units of 60ms. */
  index?: number;
  className?: string;
  /** Render as `li` when the reveal is a direct child of a list, so the markup stays valid. */
  as?: 'div' | 'li';
}

/**
 * Reveals a block once it enters the viewport.
 *
 * Deliberately an IntersectionObserver driving a CSS class rather than a JS tween: React's
 * StrictMode double-mount cancels mount-triggered tweens and can strand elements at opacity 0,
 * which silently hides content. A class toggle cannot fail that way, and reduced motion is
 * already handled by the global media query that neutralises transitions.
 */
export function Reveal({ children, index = 0, className, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>}
      className={cn('reveal', shown && 'reveal-in', className)}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {children}
    </Tag>
  );
}
