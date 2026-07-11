# OSOS Engineering & Consulting Platform

Official bilingual corporate web application for **OSOS Engineering Consultants**. This platform features a high-performance frontend, a secure admin dashboard, and automated optimization tools.

## 🚀 Key Features

* **Bilingual UI & RTL Support**: Complete translation switch with smooth CSS layout mirroring (LTR to RTL) for English and Arabic.
* **Interactive Geographic Maps**: Dynamic office location maps utilizing Leaflet, custom pins, and split-screen layouts.
* **Interactive Media Card Hovers**: Project cards dynamically stream silent video loops on hover, with metadata preloaded for instant playback.
* **Interactive Parallax Grid**: Accelerometer-supported grid background that tilts based on cursor moves (desktop) and phone tilts (mobile).
* **Secure Admin Control Panel**: Fully featured dashboard protected by JWT token authentication for content management (Projects, Credentials, Partners, Inbox).
* **Dynamic WebP Media Compressor**: Client-side canvas image optimizer that crops, rescales, and compresses raw images to WebP format before uploading to Vercel Blob.
* **Proactive Session Guard**: Auto-logout checks that run periodically and on window focus to gracefully redirect expired sessions to the login screen.
* **Google Rankings & Core Web Vitals**:
  * Dynamic metadata header manager hook (`useSEO`).
  * Structured JSON-LD `ProfessionalService` schema scripts for rich search snippets.
  * Largest Contentful Paint (LCP) preloads and dns-prefetch configurations.
  * Moving linear gradient Shimmer Skeletons for layout shift protection (CLS).
  * Auto-generated crawler indexers (`robots.txt` and `sitemap.xml`).

## 🛠️ Tech Stack
* **Frontend**: React.js, Vite, Vanilla CSS, Leaflet Maps, Swiper.
* **Backend**: Python (FastAPI) serverless consolidated structure.
* **Database**: PostgreSQL (hosted on Vercel).
* **Storage**: Vercel Blob Storage.
* **Deployment**: Vercel.

## ⚙️ Project Setup

### Local Development
To run the complete application (both the React frontend and the Python serverless API backend) under the same origin with proper routing:
1. Install Vercel CLI globally if you haven't:
   ```bash
   npm install -g vercel
   ```
2. Link your Vercel project:
   ```bash
   vercel link
   ```
3. Run the Vercel local development environment:
   ```bash
   vercel dev
   ```
This will automatically launch the unified frontend and backend proxy on `http://localhost:3000`.

### Backend Database Init & Seeding
Ensure you have configured your environment variables, then run:
```bash
python setup_database.py
```

## 🔑 Environment Variables
Configure the following keys in your `.env` (locally) or Vercel Project Dashboard (production):

| Variable | Description |
|---|---|
| `POSTGRES_URL` | The PostgreSQL database connection URI. |
| `SECRET_KEY` | Long, secure random string used to sign JWT admin session tokens. |
| `BLOB_READ_WRITE_TOKEN` | Access token for the Vercel Blob media storage bucket. |
| `RESEND_API_KEY` | (Optional) Email SMTP delivery API key for contact alerts. |

