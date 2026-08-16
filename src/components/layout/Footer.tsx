import type { Profile } from '../../types';

interface FooterProps {
  profile: Profile;
}

export function Footer({ profile }: FooterProps) {
  return (
    <footer className="border-t-2 border-line bg-ink text-paper">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <a href="#top" className="font-display text-2xl font-black uppercase">
          VK<span className="text-signal">.</span>
        </a>

        <p className="mono text-xs text-paper/60">
          {new Date().getFullYear()} {profile.firstName} {profile.lastName} · {profile.location}
        </p>

        <div className="mono flex gap-5 text-xs tracking-[0.12em] uppercase">
          <a href={profile.githubUrl} target="_blank" rel="noreferrer noopener" className="hover:text-signal">
            GitHub
          </a>
          <a href={profile.linkedinUrl} target="_blank" rel="noreferrer noopener" className="hover:text-signal">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} className="hover:text-signal">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
