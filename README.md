<div align="center">
  <h1 align="center">MORELLO</h1>
  <p align="center">
    <strong>Where Cinema Lives.</strong>
  </p>
  <p align="center">
    A premium, cinematic movie discovery platform built with modern web technologies.
  </p>
</div>

---

## 📽️ About Morello

Morello is not just a movie database; it's an immersive experience designed for cinephiles. We've moved beyond simple grids and text to create a platform that feels like the movies themselves—dramatic, visual, and engaging.

With a focus on **visual storytelling**, Morello utilizes custom AI-generated imagery, glassmorphic UI elements, and smooth animations to present movie data in a way that respects the art form.

## ✨ Key Features

- **Cinematic Hero Sections**: Immersive, full-screen visual introductions for every page.
- **Premium UI Design**: Custom "Glassmorphism" cards, dark mode aesthetic, and refined typography.
- **AI-Enhanced Visuals**: Unique, AI-generated assets for "About", "Press", "Contact", and "Privacy" pages, creating a bespoke look.
- **Real-time Data**: Powered by the **TMDB API** for the latest trending movies, details, and cast information.
- **Responsive Animations**: Smooth transitions, hover effects, and parallax scrolling touches.
- **Modern Tech Stack**: Built for speed and performance.

## 🛠️ Technology Stack

- **Framework**: [React](https://reactjs.org/) (TypeScript)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Source**: [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api)

## 🚀 Getting Started

Follow these steps to set up Morello locally on your machine.

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/morello.git
    cd morello
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your TMDB API key:
    ```env
    # Application Configuration
    # Get your API key from TMDB (https://www.themoviedb.org/settings/api)
    VITE_TMDB_API_KEY=your_tmdb_api_key_here
    ```

4.  **Run the application**
    ```bash
    npm run dev
    ```

5.  Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## 📂 Project Structure

```
src/
├── assets/         # Custom AI-generated images and static assets
├── components/     # Reusable UI components (GlassCard, Navbar, Footer)
├── pages/          # Main application pages (Home, About, Contact, Press, Privacy)
├── services/       # API services (tmdb.ts)
└── App.tsx         # Main application entry point with routing
```

## 🎨 Design Philosophy

Morello follows a "Dark Luxury" aesthetic:
- **Colors**: primarily Black (`#000`), Zinc (`#18181b`), and White, with accent colors for specific sections (Emerald for Privacy, Orange for Contact).
- **Typography**: Clean sans-serif fonts with uppercase tracking for headings, and serif fonts for emotional impact.
- **Imagery**: High-quality, atmospheric, and intentionally curated.

---

<div align="center">
  <p>Built with 🖤 by the Morello Team</p>
</div>
