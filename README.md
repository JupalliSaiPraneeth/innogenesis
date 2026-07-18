# INNOGENESIS 2026 — NRI University Hackathon

A polished React + Vite landing website for the INNOGENESIS 2026 national-level hackathon hosted by NRI Deemed to be University.

## 🌐 Website Overview

This website presents:

- Event introduction and high-level overview
- Organizing committee with chief patrons, conveners, members, and coordinators
- Hackathon tracks, problem domains, and judging categories
- Awards & prizes details with modern UI cards
- Entertainment and social schedule imagery with centered fade overlays
- FAQ section and contact info for team coordination

## 🎨 Design & Experience

- Dark cyber aesthetic with glassmorphic surfaces
- Responsive layout for mobile, tablet, and desktop
- Full-width image cards with centered cropping and fade effects
- Gradient accent styling and motion-focused micro-interactions
- Lightweight, accessible React component structure

## 🧱 Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- Lucide React icons
- esbuild build tooling

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Really
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open the app at `http://localhost:3000`.

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

### 6. Clean generated files

```bash
npm run clean
```

## 📁 Project Structure

```text
src/
  App.tsx
  main.tsx
  index.css
  types.ts
  components/
    About.tsx
    Contact.tsx
    Footer.tsx
    Header.tsx
    Home.tsx
    IntroOverlay.tsx
    Logo.tsx
    Prizes.tsx
    Starfield.tsx
    Tracks.tsx
    WhatsAppButton.tsx
public/
  ...static assets and image files...
package.json
vite.config.ts
tsconfig.json
README.md
```

## 📌 Key Files

- `src/App.tsx` — application shell and page state routing
- `src/components/About.tsx` — about section, committee cards, and event details
- `src/components/Prizes.tsx` — awards, prizes, entertainment cards, and fade effects
- `src/components/Footer.tsx` — footer content and event links
- `src/types.ts` — shared data objects for committee, tracks, and links

## 🛠 Developer Notes

- `src/types.ts` contains committee member data and track definitions.
- The entertainment cards now use centered background image cropping and hover fade overlays.
- Tailwind classes are used throughout for layout and styling.
- Keep static images inside `public/` so Vite can serve them correctly.

## 💡 Tips for Contributors

- Follow existing utility-first styling in Tailwind.
- Update content in `src/types.ts` for event details and committee lists.
- Ensure accessibility by preserving alt text and semantic structure.
- Use `npm run lint` to validate TypeScript types.

## 📦 Scripts

- `npm run dev` — start local dev server
- `npm run build` — create production build
- `npm run preview` — preview built output
- `npm run clean` — remove `dist/` and generated server file
- `npm run lint` — run TypeScript type check only

## 📄 GitHub Documentation

Use this README as the main project documentation for GitHub. It explains how to run the project locally, build for production, and understand the main code structure. Add a small `CONTRIBUTING.md` or `DEPLOYMENT.md` later if you want to capture team workflow or hosting details.
