import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';
import type { Certification, Experience } from '../../types';

interface JourneyProps {
  experience: Experience[];
  certifications: Certification[];
}

function TimelineEntry({ entry, index }: { entry: Experience; index: number }) {
  return (
    <Reveal as="li" index={index} className="relative pb-10 pl-6 last:pb-0">
      <span
        className={`absolute top-1.5 -left-[7px] h-3 w-3 border-2 border-line ${
          entry.kind === 'WORK' ? 'bg-signal' : 'bg-paper'
        }`}
        aria-hidden="true"
      />
      <p className="mono mb-1 text-xs text-signal">{entry.period}</p>
      <h4 className="text-xl uppercase">{entry.role}</h4>
      <p className="mono mt-1 mb-3 text-xs text-muted">
        {entry.organisation} · {entry.location}
      </p>
      <ul className="space-y-2">
        {entry.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2.5 text-sm leading-relaxed text-muted">
            <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-line" />
            {bullet}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function Journey({ experience, certifications }: JourneyProps) {
  const work = experience.filter((entry) => entry.kind === 'WORK');
  const education = experience.filter((entry) => entry.kind === 'EDUCATION');

  return (
    <section id="journey" className="scroll-mt-20 py-20 md:py-28">
      <div className="container-page">
        <SectionHeader
          span="journey.scan"
          title="Journey"
          description="Where I have worked, what I studied, and what I have certified along the way."
        />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
          <div>
            <h3 className="label mb-6">Experience</h3>
            <ol className="border-l-2 border-line">
              {work.map((entry, index) => (
                <TimelineEntry key={entry.slug} entry={entry} index={index} />
              ))}
            </ol>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="label mb-6">Education</h3>
              <ol className="border-l-2 border-line">
                {education.map((entry, index) => (
                  <TimelineEntry key={entry.slug} entry={entry} index={index} />
                ))}
              </ol>
            </div>

            <div>
              <h3 className="label mb-6">Certifications</h3>
              <ul className="grid gap-3">
                {certifications.map((certification, index) => (
                  <Reveal
                    as="li"
                    key={certification.slug}
                    index={index}
                    className="brut-sm brut-press flex items-center justify-between gap-4 p-4"
                  >
                    <span>
                      <span className="block font-semibold">{certification.title}</span>
                      <span className="mono block text-xs text-muted">{certification.issuer}</span>
                    </span>
                    <span className="mono shrink-0 text-xs text-signal">
                      {certification.awarded}
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
