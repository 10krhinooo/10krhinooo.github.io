import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SectionHeader } from '../ui/SectionHeader';
import { Reveal } from '../ui/Reveal';
import { Tag } from '../ui/Tag';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { trackEvent } from '../../lib/api';
import type { Project } from '../../types';

interface WorkProps {
  projects: Project[];
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="brut flex h-full w-full flex-col p-6 md:p-8">
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className="label">{project.category}</span>
        <span className="font-display text-4xl leading-none font-black text-signal">
          {project.number}
        </span>
      </div>

      <h3 className="text-[clamp(1.5rem,3vw,2.25rem)] uppercase">{project.title}</h3>
      <p className="mono mt-1 text-xs text-muted">{project.period}</p>

      <p className="mt-4 flex-1 leading-relaxed text-muted">{project.description}</p>

      <ul className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <li key={tag}>
            <Tag>{tag}</Tag>
          </li>
        ))}
      </ul>

      {(project.repoUrl || project.liveUrl) && (
        <div className="mt-5 flex flex-wrap gap-2 border-t-2 border-line/30 pt-5">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackEvent('project_click', project.slug)}
              className="brut-sm brut-press mono inline-flex items-center gap-2 px-3 py-2 text-[0.6875rem] tracking-[0.12em] uppercase"
            >
              Source <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackEvent('project_click', `${project.slug}_live`)}
              className="brut-sm brut-press mono inline-flex items-center gap-2 bg-signal px-3 py-2 text-[0.6875rem] tracking-[0.12em] text-white uppercase"
            >
              Live <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      )}
    </article>
  );
}

/**
 * Desktop pins the section and advances the cards sideways as the page scrolls, so the work reads
 * as one continuous pass rather than a wall of tiles. Narrow screens and reduced-motion visitors
 * get the same cards as an ordinary vertical list, which is the honest degradation: nothing is
 * hidden, only the choreography is dropped.
 */
export function Work({ projects }: WorkProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canPin = useMediaQuery('(min-width: 1024px)');
  const reduced = useReducedMotion();
  const pinned = canPin && !reduced;

  // Measured in pixels rather than expressed as a percentage: a percentage translate resolves
  // against the lane's own width, which is many times the viewport, so it would overshoot wildly.
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (!pinned) return;

    const measure = () => {
      const lane = laneRef.current;
      const viewport = viewportRef.current;
      if (!lane || !viewport) return;
      setDistance(Math.max(0, lane.scrollWidth - viewport.clientWidth));
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [pinned, projects.length]);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  if (!pinned) {
    return (
      <section id="work" className="scroll-mt-20 py-20 md:py-28">
        <div className="container-page">
          <SectionHeader
            span="work.query"
            title="Selected work"
            description="Systems I have designed, built, or kept running."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project, index) => (
              <Reveal key={project.slug} index={index}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="work" className="scroll-mt-20 pt-20 md:pt-28">
      <div className="container-page">
        <SectionHeader
          span="work.query"
          title="Selected work"
          description="Systems I have designed, built, or kept running. Keep scrolling to move through them."
        />
      </div>

      <div ref={trackRef} style={{ height: `${projects.length * 55}vh` }}>
        <div
          ref={viewportRef}
          className="sticky top-[4.5rem] flex h-[calc(100dvh-4.5rem)] items-center overflow-hidden"
        >
          <motion.div ref={laneRef} style={{ x }} className="flex gap-6 px-5 md:px-10">
            {projects.map((project) => (
              <div key={project.slug} className="h-[min(32rem,74vh)] w-[min(29rem,78vw)] shrink-0">
                <ProjectCard project={project} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
