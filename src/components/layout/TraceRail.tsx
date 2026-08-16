import { cn } from '../../lib/cn';
import { SPANS } from '../../lib/sections';

interface TraceRailProps {
  activeId: string;
}

/**
 * The signature element: a distributed-trace waterfall standing in for the page's progress.
 *
 * Each section is a span, offset and sized like a real trace viewer, and the one you are reading
 * is highlighted. It encodes the actual traversal order rather than decorating it, and it is the
 * clearest way to say "this person reads traces for a living" without a fake dashboard.
 *
 * Desktop only. There is no room for it on a phone and no honest way to shrink it.
 */
export function TraceRail({ activeId }: TraceRailProps) {
  const activeIndex = Math.max(
    0,
    SPANS.findIndex((span) => span.id === activeId)
  );

  return (
    <aside
      className="pointer-events-none fixed top-1/2 left-6 z-30 hidden -translate-y-1/2 xl:block"
      aria-hidden="true"
    >
      <div className="mono w-52 border-2 border-line bg-surface p-3 text-[0.625rem] shadow-[var(--shadow-brut-sm)]">
        <div className="mb-2 flex items-center justify-between border-b-2 border-line pb-2 tracking-[0.14em] uppercase">
          <span>trace</span>
          <span className="text-muted">{activeIndex + 1}/{SPANS.length}</span>
        </div>

        <ul className="space-y-1.5">
          {SPANS.map((span, index) => {
            const done = index < activeIndex;
            const active = index === activeIndex;
            return (
              <li key={span.id} className="flex items-center gap-2">
                {/* Bars are indented by depth so the group reads as a waterfall, not a list. */}
                <span className="flex h-2 flex-1 items-center" style={{ paddingLeft: index * 6 }}>
                  <span
                    className={cn(
                      'h-2 w-full transition-colors duration-300',
                      active ? 'bg-signal' : done ? 'bg-line/50' : 'bg-line/15'
                    )}
                  />
                </span>
                <span
                  className={cn(
                    'w-24 shrink-0 truncate text-right transition-colors duration-300',
                    active ? 'text-ink' : 'text-muted'
                  )}
                >
                  {span.span}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
