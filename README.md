# Maths Club

A responsive maths learning website for Grades 6–9. Each grade has three open levels, with original lesson material, a worked example, five multiple-choice questions, and explained results. Draft answers, previous attempts, and best scores are saved in the current browser using localStorage.

## Preview

No package installation or build is needed. From this directory, run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:4173`.

## Checks

```sh
node --check dist/app.js
node --check dist/curriculum.js
node verify.mjs
```

The checks cover 42 page routes, the 60 answer keys, and scoring across all 12 levels. Browser QA also covers the grade menu, incomplete submissions, mixed correct/incorrect answers, feedback, retries, persistence, and responsive layouts.

## Files

- `dist/index.html`: semantic page shell and navigation.
- `dist/styles.css`: design and responsive layouts.
- `dist/curriculum.js`: lessons and question bank.
- `dist/app.js`: routes, quiz interactions, scoring, feedback, and local progress.

No student accounts or server-side student records are collected. Browser progress is local to that browser and device. Fonts use Google Fonts with local sans-serif fallbacks. Lessons are a general practice collection, rather than a complete or accredited school curriculum.
