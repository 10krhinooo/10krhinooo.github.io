import { useEffect, useState } from 'react';
import { fetchWithFallback } from '../lib/api';
import { fallbackContent } from '../data/fallback';
import type { ApiTrace, Content, GithubStats } from '../types';

const EMPTY_GITHUB: GithubStats = {
  publicRepos: 0,
  totalStars: 0,
  languages: {},
  topRepos: [],
};

/**
 * Loads everything the page renders.
 *
 * Content comes from one aggregate call so a cold backend costs a single wait rather than six.
 * The GitHub stats are requested separately and are allowed to stay empty, since that section
 * hides itself rather than showing a broken shell.
 */
export function useContent() {
  const [content, setContent] = useState<Content>(fallbackContent);
  const [github, setGithub] = useState<GithubStats>(EMPTY_GITHUB);
  const [trace, setTrace] = useState<ApiTrace>({ state: 'loading', latencyMs: null, status: null });

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const result = await fetchWithFallback<Content>('/api/content', fallbackContent);
      if (cancelled) return;

      setContent(result.data);
      setTrace({
        state: result.live ? 'live' : 'fallback',
        latencyMs: result.latencyMs,
        status: result.status,
      });

      const stats = await fetchWithFallback<GithubStats>('/api/github/stats', EMPTY_GITHUB);
      if (!cancelled && stats.live) setGithub(stats.data);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { content, github, trace };
}
