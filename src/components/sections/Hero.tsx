import { useReducedMotion } from '../../hooks/useReducedMotion';
import { trackEvent } from '../../lib/api';
import type { ApiTrace, Profile, Stat } from '../../types';

interface HeroProps {
  profile: Profile;
  stats: Stat[];
  trace: ApiTrace;
}

/**
 * The thesis: this page is served by a backend its author wrote, and it says so with a real
 * measurement rather than a claim. When the API is asleep the line reports that honestly instead
 * of hiding it, which is the more interesting statement anyway.
 */
function StatusLine({ trace }: { trace: ApiTrace }) {
  const { state, latencyMs, status } = trace;

  const detail =
    state === 'loading'
      ? 'connecting'
      : state === 'live'
        ? `${status} · ${latencyMs}ms`
        : 'offline · serving bundled copy';

  return (
    <div className="mono flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] tracking-wide">
      <span
        className={
          state === 'live'
            ? 'h-2 w-2 shrink-0 bg-signal'
            : state === 'loading'
              ? 'h-2 w-2 shrink-0 animate-pulse bg-muted'
              : 'h-2 w-2 shrink-0 bg-alert'
        }
        aria-hidden="true"
      />
      <span className="text-muted">GET /api/content</span>
      <span className={state === 'fallback' ? 'text-alert' : 'text-ink'}>{detail}</span>
    </div>
  );
}

export function Hero({ profile, stats, trace }: HeroProps) {
  const reduced = useReducedMotion();
  const lines = [profile.firstName, profile.lastName];

  return (
    <section id="top" className="relative pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container-page">
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="label">{profile.title}</span>
          <span className="h-px w-8 bg-line/40" aria-hidden="true" />
          <span className="label">{profile.location}</span>
        </div>

        {/* 12.5vw is the largest step at which the longer of the two names still clears the
            container gutters on a 360px phone. */}
        <h1 className="text-[clamp(2.5rem,12.5vw,11rem)] uppercase">
          {lines.map((line, index) => (
            <span key={line} className="block overflow-hidden">
              <span
                className={reduced ? 'block' : 'hero-line'}
                style={reduced ? undefined : { animationDelay: `${0.1 + index * 0.12}s` }}
              >
                {line}
                {index === 1 && <span className="text-signal">.</span>}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="max-w-xl text-lg leading-relaxed text-balance md:text-xl">
              {profile.tagline}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#work"
                onClick={() => trackEvent('cta_click', 'hero_work')}
                className="brut brut-press mono inline-flex items-center gap-2 bg-signal px-6 py-3.5 text-xs tracking-[0.12em] text-white uppercase"
              >
                See the work
                <span aria-hidden="true">→</span>
              </a>
              <a
                href="#contact"
                onClick={() => trackEvent('cta_click', 'hero_contact')}
                className="brut brut-press mono inline-flex items-center gap-2 px-6 py-3.5 text-xs tracking-[0.12em] uppercase"
              >
                Get in touch
              </a>
            </div>

            <div className="mt-8 border-t-2 border-line/30 pt-4">
              <StatusLine trace={trace} />
            </div>
          </div>

          {/* Stats read as a compact spec block rather than four hero-sized cards. */}
          <dl className="grid w-full grid-cols-2 border-t-2 border-l-2 border-line lg:w-80">
            {stats.map((stat) => (
              <div key={stat.label} className="border-r-2 border-b-2 border-line p-4">
                <dt className="label mb-1 block">{stat.label}</dt>
                <dd className="font-display text-3xl font-black">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
