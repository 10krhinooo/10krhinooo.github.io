import { useEffect, useState } from 'react';
import { cn } from '../../lib/cn';
import { SPANS } from '../../lib/sections';
import { trackEvent } from '../../lib/api';

interface NavProps {
  activeId: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Nav({ activeId, theme, onToggleTheme }: NavProps) {
  const [open, setOpen] = useState(false);

  // A menu that survives a resize into desktop layout would leave an unreachable overlay open.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px)');
    const close = () => query.matches && setOpen(false);
    query.addEventListener('change', close);
    return () => query.removeEventListener('change', close);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const links = SPANS.filter((span) => span.id !== 'top');

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className="container-page flex h-16 items-center justify-between border-b-2 border-line bg-paper/90 backdrop-blur-sm md:h-[4.5rem] xl:pl-60"
        aria-label="Main"
      >
        <a href="#top" className="font-display text-xl font-black tracking-tight uppercase">
          VK<span className="text-signal">.</span>
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={activeId === link.id ? 'true' : undefined}
                className={cn(
                  'mono text-xs tracking-[0.12em] uppercase transition-colors',
                  activeId === link.id ? 'text-signal' : 'text-muted hover:text-ink'
                )}
              >
                {link.nav}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="brut-sm brut-press grid h-10 w-10 place-items-center"
          >
            {/* Inline SVG rather than a glyph: the mono face has no sun or moon and falls back
                to a tofu box. */}
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              aria-hidden="true"
            >
              {theme === 'dark' ? (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
                </>
              ) : (
                <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
              )}
            </svg>
          </button>

          <a
            href="#contact"
            onClick={() => trackEvent('cta_click', 'nav_hire')}
            className="brut-sm brut-press mono hidden h-10 items-center bg-signal px-4 text-xs tracking-[0.12em] text-white uppercase sm:flex"
          >
            Hire me
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="brut-sm brut-press grid h-10 w-10 place-items-center lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="square"
              aria-hidden="true"
            >
              {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="h-[calc(100dvh-4rem)] border-b-2 border-line bg-paper lg:hidden"
        >
          <ul className="container-page flex flex-col pt-6">
            {links.map((link, index) => (
              <li key={link.id} className="border-b-2 border-line/30">
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-5"
                >
                  <span className="mono text-xs text-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-3xl font-extrabold uppercase">{link.nav}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
