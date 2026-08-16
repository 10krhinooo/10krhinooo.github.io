import { useId, useState, type FormEvent } from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { Reveal } from '../ui/Reveal';
import { submitContact, trackEvent } from '../../lib/api';
import type { Profile } from '../../types';

interface ContactProps {
  profile: Profile;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function Contact({ profile }: ContactProps) {
  const formId = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus('sending');
    setFieldErrors({});

    const result = await submitContact({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
      website: String(data.get('website') ?? ''),
    });

    if (result.ok) {
      setStatus('sent');
      setMessage('Message sent. I will get back to you.');
      form.reset();
      trackEvent('contact_submit');
      return;
    }

    setStatus('error');
    setMessage(result.message);
    setFieldErrors(result.fields ?? {});
  }

  const links = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
    { label: 'LinkedIn', value: 'victor-kimanga', href: profile.linkedinUrl },
    { label: 'GitHub', value: '10krhinooo', href: profile.githubUrl },
  ];

  return (
    <section id="contact" className="scroll-mt-20 py-20 md:py-28">
      <div className="container-page">
        <SectionHeader
          span="contact.open"
          title="Let's build something"
          description="Open to backend roles, contract work, and interesting problems."
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <Reveal>
            <ul className="grid gap-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                    onClick={() => trackEvent('contact_link', link.label.toLowerCase())}
                    className="brut brut-press flex items-center justify-between gap-4 p-5"
                  >
                    <span>
                      <span className="label mb-1 block">{link.label}</span>
                      <span className="mono text-sm break-all">{link.value}</span>
                    </span>
                    <span aria-hidden="true" className="shrink-0 text-signal">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal index={1}>
            <form onSubmit={handleSubmit} className="brut p-6 md:p-8" noValidate>
              <div className="grid gap-5">
                <div>
                  <label htmlFor={`${formId}-name`} className="label mb-2 block">
                    Your name
                  </label>
                  <input
                    id={`${formId}-name`}
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    aria-invalid={Boolean(fieldErrors.name)}
                    className="w-full border-2 border-line bg-paper px-4 py-3 outline-none focus:border-signal"
                  />
                  {fieldErrors.name && (
                    <p className="mono mt-1.5 text-xs text-alert">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${formId}-email`} className="label mb-2 block">
                    Email address
                  </label>
                  <input
                    id={`${formId}-email`}
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    aria-invalid={Boolean(fieldErrors.email)}
                    className="w-full border-2 border-line bg-paper px-4 py-3 outline-none focus:border-signal"
                  />
                  {fieldErrors.email && (
                    <p className="mono mt-1.5 text-xs text-alert">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${formId}-message`} className="label mb-2 block">
                    Message
                  </label>
                  <textarea
                    id={`${formId}-message`}
                    name="message"
                    rows={5}
                    required
                    aria-invalid={Boolean(fieldErrors.message)}
                    className="w-full resize-y border-2 border-line bg-paper px-4 py-3 outline-none focus:border-signal"
                  />
                  {fieldErrors.message && (
                    <p className="mono mt-1.5 text-xs text-alert">{fieldErrors.message}</p>
                  )}
                </div>

                {/* Honeypot. Hidden from people and from screen readers, irresistible to bots. */}
                <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
                  <label htmlFor={`${formId}-website`}>Leave this field empty</label>
                  <input id={`${formId}-website`} name="website" type="text" tabIndex={-1} />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="brut-sm brut-press mono bg-signal px-6 py-4 text-xs tracking-[0.12em] text-white uppercase disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending' : 'Send message'}
                </button>

                <p
                  role="status"
                  aria-live="polite"
                  className={
                    status === 'error'
                      ? 'mono text-xs text-alert'
                      : 'mono text-xs text-signal'
                  }
                >
                  {message}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
