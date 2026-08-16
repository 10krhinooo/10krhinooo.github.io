import { useReducedMotion } from '../../hooks/useReducedMotion';

interface MarqueeProps {
  items: string[];
}

/** A continuous band of the stack. Duplicated once so the loop has no visible seam. */
export function Marquee({ items }: MarqueeProps) {
  const reduced = useReducedMotion();
  const track = [...items, ...items];

  if (reduced) {
    return (
      <div className="scroll-x border-y-2 border-line bg-ink py-3">
        <div className="mono flex w-max gap-8 px-5 text-xs tracking-[0.16em] text-paper uppercase">
          {items.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border-y-2 border-line bg-ink py-3">
      <div className="mono flex w-max animate-[marquee_38s_linear_infinite] gap-8 text-xs tracking-[0.16em] text-paper uppercase">
        {track.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-8">
            {item}
            <span className="text-signal" aria-hidden="true">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
