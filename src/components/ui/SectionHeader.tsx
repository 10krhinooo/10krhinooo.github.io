import { Reveal } from './Reveal';

interface SectionHeaderProps {
  /** The span name shown in the trace rail, repeated here so the two read as one system. */
  span: string;
  title: string;
  description: string;
}

export function SectionHeader({ span, title, description }: SectionHeaderProps) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 shrink-0 bg-signal" aria-hidden="true" />
        <span className="label">{span}</span>
        <span className="h-px flex-1 bg-line/40" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-[clamp(2.25rem,6vw,4.5rem)] uppercase">{title}</h2>
      <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">{description}</p>
    </Reveal>
  );
}
