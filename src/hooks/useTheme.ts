import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function currentTheme(): Theme {
  const attribute = document.documentElement.getAttribute('data-theme');
  return attribute === 'dark' ? 'dark' : 'light';
}

/**
 * Reads the theme the blocking script in index.html already applied, then keeps it in sync with
 * the toggle. The initial value comes from the DOM rather than storage so React never disagrees
 * with what is already painted.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* private browsing, the choice just will not persist */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((previous) => (previous === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggle };
}
