# Excel Poster Generator

A client-side React app that reads an Excel file with story and character assignments, lets you assign stories to Sundays in a month, and exports a poster as a high-quality PNG.

## Features

- Upload Excel once (data saved in browser `localStorage`)
- Reads the **teams** sheet (second tab in your workbook)
- Columns: **Story**, **Character**, **Team 1**, **Team 2**
- Empty Story cells inherit the story name from the row above
- Select month and team (Team 1 or Team 2)
- Assign stories to each Sunday in the month
- Live poster preview matching the reference layout
- Download PNG via `html-to-image`

## Getting Started

```bash
npm install
npm run generate-sample
npm run dev
```

Open http://localhost:5173

## Excel Format

| Story | Character | Team 1 | Team 2 |
| ----- | --------- | ------ | ------ |
| Sonu & Meow | Aman | Krishna S | ... |
| Sonu & Meow | AV | Manisha | ... |

- Group characters under each story
- Use an `AV` character row for the AV line on the poster
- `All characters` summary rows are ignored

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run build:gh` | Build for GitHub Pages |
| `npm run deploy` | Deploy to GitHub Pages |
| `npm run generate-sample` | Regenerate `public/sample-data.xlsx` |

## GitHub Pages Deployment

1. Update `base` in `vite.config.js` if your repo name is not `exceltoimage`
2. Run:

```bash
npm run deploy
```

3. Enable GitHub Pages from the `gh-pages` branch in repo settings

## Tech Stack

- React + Vite (JavaScript)
- Tailwind CSS
- SheetJS (`xlsx`) for Excel parsing
- `html-to-image` for PNG export
