# 10krhinooo.github.io

Personal portfolio site for Victor Kimanga — Backend Software Developer. Static single-page site served via GitHub Pages.

## Structure

```
index.html          Page markup — hero, skills, projects, experience/education, certifications, contact
css/stylesheet.css   Styling — dark terminal-inspired theme, animations, responsive layout
js/script.js         Interactivity — mobile nav, scroll reveal, scrollspy, scroll progress, back-to-top, contact form submission
```

## Running locally

No build step — just serve the directory statically, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Contact form

The contact form posts to a backend API (`js/script.js`) for delivery; update the endpoint there if the backend URL changes.
