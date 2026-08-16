import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';
import { trackEvent } from '../../lib/api';
import type { GithubStats, Profile } from '../../types';

interface ActivityProps {
  github: GithubStats;
  profile: Profile;
}

function relativeTime(iso: string | null): string {
  if (!iso) return 'unknown';
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function Activity({ github, profile }: ActivityProps) {
  // The section is entirely API-driven. With no live data there is nothing truthful to show, so
  // it removes itself rather than rendering an empty shell.
  if (github.publicRepos === 0) return null;

  const languages = Object.entries(github.languages);
  const total = languages.reduce((sum, [, count]) => sum + count, 0);

  return (
    <section id="activity" className="scroll-mt-20 py-20 md:py-28">
      <div className="container-page">
        <SectionHeader
          span="github.fetch"
          title="Live from GitHub"
          description="Pulled from the GitHub API through my own service, cached for an hour."
        />

        <div className="grid gap-5 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <Reveal>
            <div className="brut h-full p-6">
              <h3 className="mb-5 text-lg uppercase">Language mix</h3>
              <ul className="space-y-3">
                {languages.map(([language, count]) => (
                  <li key={language}>
                    <div className="mono mb-1 flex justify-between text-xs">
                      <span>{language}</span>
                      <span className="text-muted">{count}</span>
                    </div>
                    <div className="h-2.5 border-2 border-line">
                      <div
                        className="h-full bg-signal"
                        style={{ width: `${Math.round((count / total) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="mono mt-6 grid grid-cols-2 gap-3 border-t-2 border-line/30 pt-5 text-xs">
                <div>
                  <dt className="text-muted">Public repos</dt>
                  <dd className="font-display text-2xl font-black">{github.publicRepos}</dd>
                </div>
                <div>
                  <dt className="text-muted">Stars</dt>
                  <dd className="font-display text-2xl font-black">{github.totalStars}</dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {github.topRepos.map((repo, index) => (
              <Reveal key={repo.name} index={index}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => trackEvent('project_click', repo.name)}
                  className="brut brut-press flex h-full flex-col p-5"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="mono text-sm font-bold normal-case">{repo.name}</h3>
                    <span aria-hidden="true" className="text-signal">
                      ↗
                    </span>
                  </div>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-muted">
                    {repo.description ?? 'No description yet.'}
                  </p>
                  <div className="mono flex items-center gap-3 text-[0.6875rem] text-muted">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 bg-signal" aria-hidden="true" />
                        {repo.language}
                      </span>
                    )}
                    <span>pushed {relativeTime(repo.pushedAt)}</span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-6">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => trackEvent('cta_click', 'github_profile')}
            className="brut-sm brut-press mono inline-flex items-center gap-2 px-4 py-3 text-xs tracking-[0.12em] uppercase"
          >
            All repositories <span aria-hidden="true">↗</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
