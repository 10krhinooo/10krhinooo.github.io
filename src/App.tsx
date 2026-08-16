import { useEffect } from 'react';
import { Nav } from './components/layout/Nav';
import { Footer } from './components/layout/Footer';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { TraceRail } from './components/layout/TraceRail';
import { Hero } from './components/sections/Hero';
import { Skills } from './components/sections/Skills';
import { Work } from './components/sections/Work';
import { Activity } from './components/sections/Activity';
import { Journey } from './components/sections/Journey';
import { Contact } from './components/sections/Contact';
import { Marquee } from './components/ui/Marquee';
import { useTheme } from './hooks/useTheme';
import { useScrollSpy } from './hooks/useScrollSpy';
import { useContent } from './hooks/useContent';
import { trackEvent } from './lib/api';
import { SPAN_IDS } from './lib/sections';

export function App() {
  const { theme, toggle } = useTheme();
  const { content, github, trace } = useContent();
  const activeId = useScrollSpy(SPAN_IDS);

  useEffect(() => {
    trackEvent('page_view');
  }, []);

  const marqueeItems = content.skills.flatMap((group) => group.items).slice(0, 24);

  return (
    <>
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:border-2 focus:border-line focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <ScrollProgress />
      <Nav activeId={activeId} theme={theme} onToggleTheme={toggle} />
      <TraceRail activeId={activeId} />

      {/* The rail is fixed in the left gutter, so from xl up the page reserves that column and
          nothing scrolls underneath it. */}
      <div className="xl:pl-60">
        <main>
          <Hero profile={content.profile} stats={content.stats} trace={trace} />
          <Marquee items={marqueeItems} />
          <Skills skills={content.skills} />
          <Work projects={content.projects} />
          <Activity github={github} profile={content.profile} />
          <Journey experience={content.experience} certifications={content.certifications} />
          <Contact profile={content.profile} />
        </main>

        <Footer profile={content.profile} />
      </div>
    </>
  );
}
