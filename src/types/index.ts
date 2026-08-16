export interface Profile {
  firstName: string;
  lastName: string;
  title: string;
  location: string;
  tagline: string;
  email: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string | null;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  title: string;
  number: string;
  category: string;
  description: string;
  period: string;
  tags: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  thumbnailUrl: string | null;
  featured: boolean;
}

export interface Experience {
  slug: string;
  role: string;
  organisation: string;
  location: string;
  period: string;
  kind: 'WORK' | 'EDUCATION';
  bullets: string[];
}

export interface SkillGroup {
  slug: string;
  title: string;
  icon: string;
  items: string[];
}

export interface Certification {
  slug: string;
  title: string;
  issuer: string;
  awarded: string;
  credentialUrl: string | null;
}

export interface Content {
  profile: Profile;
  stats: Stat[];
  projects: Project[];
  experience: Experience[];
  skills: SkillGroup[];
  certifications: Certification[];
}

export interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  url: string;
  homepage: string | null;
  pushedAt: string | null;
}

export interface GithubStats {
  publicRepos: number;
  totalStars: number;
  languages: Record<string, number>;
  topRepos: GithubRepo[];
}

/** Where the rendered content came from, surfaced honestly in the hero status line. */
export type ApiState = 'loading' | 'live' | 'fallback';

export interface ApiTrace {
  state: ApiState;
  /** Round trip in milliseconds, present once a live call has completed. */
  latencyMs: number | null;
  status: number | null;
}
