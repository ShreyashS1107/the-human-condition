# THE HUMAN CONDITION

> *A Digital Journey Through What It Means to Exist.*

An experimental, interactive digital art installation exploring existence, philosophy, identity, freedom, memory, and choice.

---

## The Seven Stages

1. **Stage 01 — Opening**: A dark entrance confronting the visitor with apparent choice and psychological manipulation (*"ARE YOU SURE YOU WANT TO ENTER?"*).
2. **Stage 02 — Tour Selection**: Three distant 3D physical portals emerging from the cosmic void to orient the inquiry.
3. **Stage 03 — The Library of Human Thought**: An impossible archival library with five philosophical figures (Socrates, Friedrich Nietzsche, Fyodor Dostoevsky, Albert Camus, Virginia Woolf), Socratic dialogues, and collectible codices.
4. **Stage 04 — The Museum of Lost Ideas**: Seven conceptual chambers floating in space exploring *Meaning, Death, Love, Freedom, Identity, Time,* and *Loneliness*.
5. **Stage 05 — The Book That Reads You**: An intimate literary ritual with a procedural 3D codex that questions the visitor, analyzes thematic tensions, and synthesizes a personalized philosophical manuscript letter across three folios.
6. **Stage 06 — The Nietzsche Machine**: An abstract cosmic 3D machine that reconstructs the visitor's authentic words and choices, accelerates into fragment collisions, poses the central questions of uncertainty, and destabilizes the interface into complete silence.
7. **Stage 07 — The End**: An authentic Sanskrit verse from the *Mahabharata* (*Strīparva 11.2.3*), followed by its English translation, "THE END", and permanent darkness with zero conventional UI.

---

## Technologies Used

* **React 19** & **Vite**: Client runtime and lightning-fast ES module bundler.
* **Three.js** & **React Three Fiber (`@react-three/fiber`)**: 3D spatial environments, procedural geometry, and dynamic camera choreography.
* **`@react-three/drei`**: Spatial helpers, text rendering, and environment components.
* **Web Audio API**: Procedural, real-time sound synthesizer (binaural sub-bass drones, low-pass filter sweeps, and proximity acoustic feedback).
* **Lenis**: Smooth inertia scrolling integration.
* **Google Fonts**: `Cinzel`, `Cormorant Garamond`, `Noto Serif Devanagari`, and `Space Mono`.

---

## Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd "The human condition"

# Install dependencies
npm install
```

### Running Locally
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### Production Build
```bash
npm run build
```
The compiled static production bundle will be generated in the `dist/` directory, ready for deployment to any standard static web host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, AWS S3, etc.).

To preview the production build locally:
```bash
npm run preview
```

---

## Architecture & Synthesis Engine

* **Free-First & Deterministic**: The project runs 100% out of the box without requiring any API keys or paid external services.
* **Philosophical Letter Engine**: Stage 05 utilizes a local deterministic analysis engine that evaluates recurring words and contradictions across user confessions to compose a multi-page literary manuscript.
* **Optional Remote Configuration**: If server-side AI evaluation is desired, `.env.example` documents the structure for an optional backend provider (`GEMINI_API_KEY`). Client-side code never exposes secrets.

---

## License

Free and open-source under the MIT License.
