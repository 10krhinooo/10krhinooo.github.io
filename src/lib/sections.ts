/**
 * The page reads as one traversal, so every section is a named span. The rail, the nav and each
 * section header all draw from this one list, which keeps the ordering honest.
 */
export interface Span {
  id: string;
  /** Rail and header label. */
  span: string;
  /** Nav label, shorter because the nav is tight. */
  nav: string;
}

export const SPANS: Span[] = [
  { id: 'top', span: 'identity', nav: 'Start' },
  { id: 'stack', span: 'stack.resolve', nav: 'Stack' },
  { id: 'work', span: 'work.query', nav: 'Work' },
  { id: 'activity', span: 'github.fetch', nav: 'Activity' },
  { id: 'journey', span: 'journey.scan', nav: 'Journey' },
  { id: 'contact', span: 'contact.open', nav: 'Contact' },
];

export const SPAN_IDS = SPANS.map((span) => span.id);
