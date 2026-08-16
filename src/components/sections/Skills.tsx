import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';
import { Tag } from '../ui/Tag';
import type { SkillGroup } from '../../types';

interface SkillsProps {
  skills: SkillGroup[];
}

export function Skills({ skills }: SkillsProps) {
  return (
    <section id="stack" className="scroll-mt-20 py-20 md:py-28">
      <div className="container-page">
        <SectionHeader
          span="stack.resolve"
          title="The stack"
          description="What I reach for, and what I have actually shipped with."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, index) => (
            <Reveal key={group.slug} index={index}>
              <article className="brut brut-press flex h-full flex-col p-5">
                <h3 className="mb-4 flex items-baseline gap-2 text-lg uppercase">
                  <span className="mono text-xs font-normal text-signal">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {group.title}
                </h3>
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Tag>{item}</Tag>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
