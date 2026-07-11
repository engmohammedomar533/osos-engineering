# Project Documentation: Osos Engineering Enhanced

## 1. Project Overview

The "Osos Engineering Enhanced" project is a modern, multi-language (English and Arabic) web application designed to showcase engineering projects, services, and company information. It features a dynamic frontend built with React, a consolidated serverless backend API using Python (FastAPI), and utilizes Vercel's PostgreSQL for data storage and Vercel Blob for media asset management.

The application includes a secure, authenticated administrative panel for managing projects, credentials, and partners, a contact form, and various interactive UI elements and animations.

**Key Technologies:**

*   **Frontend:** React.js, Vite, `react-router-dom`, `react-i18next`, `framer-motion`, `three.js` ecosystem, `swiper`.
*   **Backend:** Python (FastAPI) in a single-file deployment structure.
*   **Database:** PostgreSQL (hosted on Vercel).
*   **Storage:** Vercel Blob Storage.
*   **Deployment:** Vercel.

## 2. Frontend (React Application)

### 2.1. Architecture and Structure

The frontend is a Single Page Application (SPA) built with React and bundled using Vite. The core application logic and components reside within the `src` directory.

*   **`src/main.jsx`**: The entry point of the React application.
*   **`src/App.jsx`**: The main application shell. It sets up routing and manages global state (language, login status).
*   **`src/Components/`**: Contains reusable UI components.
*   **`src/AdminPanel.jsx`**: A protected route for content management.
*   **Page Components**: Other `.jsx` files in `src/` represent individual pages or major sections.

### 2.2. Core Components

*   **`App.jsx`**:
    *   Manages application-wide routing using `react-router-dom`.
    *   Handles language switching (English/Arabic) with automated CSS layout mirroring (LTR/RTL direction).
    *   Manages user login state, persisting it in `localStorage` with security token verification.
    *   **Proactive Session Guard**: Houses a periodic verification hook that checks JWT validity every 10 seconds and instantly checks validity on window `focus` (tab changes). Automatically logs out expired users, redirects to `/login`, and fires alerts in their native language.
*   **`Login.jsx`**:
    *   Provides a login interface for administrators.
    *   Submits `username` and `password` to the `/api/login` endpoint.
    *   On successful authentication, it stores the received JWT (JSON Web Token) in `localStorage` and redirects the user to the admin panel.
*   **`AdminPanel.jsx`**:
    *   A protected route accessible only to logged-in users.
    *   Features a tabbed interface for managing **Projects**, **Credentials**, **Partners**, and **Leads Inbox**.
    *   Performs full CRUD operations for each section using authenticated requests with JWT headers.
    *   **Contacts Inbox & CSV Exporter**: Includes a read-only table displaying all submitted contact messages. Contains an Excel-safe client-side CSV generator supporting UTF-8 BOM encoding so Arabic characters display correctly in Microsoft Excel.
    *   **Interactive WebP Media Compressor**: Features a custom `ImageUploader` that crops, scales, and compresses raw images to WebP format directly in the browser via canvas, reducing file sizes before streaming to Vercel Blob.
*   **`Projects.jsx`**, **`PartnersOfSuccess.jsx`**, **`Credentials.jsx`**, **`ServicesPageNew.jsx`**:
    *   Public-facing pages that display dynamic database-driven contents.
    *   **Core Web Vitals Shimmer Skeletons**: Show hardware-accelerated shimmer placeholder cards (`SkeletonCard.jsx`) during asset fetches to preserve visual stability (preventing CLS).
    *   **Media Hover Previews**: Project cards prefetch background videos (`preload="metadata"`) and toggle playback dynamically on cursor hover (playing silently) with smooth CSS opacity transitions.

### 2.3. Routing

The application uses `react-router-dom` for client-side routing.

*   **Public Routes:** `/`, `/services`, `/projects`, `/partners-of-success`, `/credentials`, etc.
*   **Authentication Routes:** `/login` for signing in, `/admin` for the protected admin panel.

## 3. Backend (API - Vercel Serverless Function)

### 3.1. Architecture

The backend has been refactored into a **single, consolidated FastAPI application** located in `api/index.py`. This approach resolves previous routing conflicts and aligns with Vercel deployment best practices. The single file defines the main FastAPI app and includes `APIRouter` instances for each resource type (projects, credentials, partners) to keep the code organized and maintainable.

All API endpoints are prefixed with `/api`.

### 3.2. Authentication & Authorization

The API is secured using JWT (JSON Web Token) based authentication.

*   **Login Flow:**
    1.  A user submits a `username` and `password` to the `POST /api/login` endpoint.
    2.  The server verifies the credentials against the `users` table in the database, using `bcrypt` for password hashing.
    3.  On success, the server generates and returns a short-lived JWT.
*   **Authorization:**
    *   All content management endpoints (POST, PUT, DELETE) are protected.
    *   To access these endpoints, the client must include the JWT in the request header: `Authorization: Bearer <JWT>`.
    *   The `get_current_user` dependency in the backend validates the token for each request.

### 3.3. API Endpoints

#### Auth
*   **`POST /api/login`**
    *   **Purpose:** Authenticate a user.
    *   **Request Body:** `{ "username": "string", "password": "string" }`
    *   **Response (Success):** `{ "access_token": "string", "token_type": "bearer" }`
    *   **Response (Error):** `401 Unauthorized` for incorrect credentials.

#### Projects
*   **`GET /api/get_projects`**: Fetches all projects.
*   **`POST /api/add_project`**: Adds a new project. (Auth required)
*   **`PUT /api/update_project/{project_id}`**: Updates a project. (Auth required)
*   **`DELETE /api/delete_project/{project_id}`**: Deletes a project. (Auth required)

#### Credentials
*   **`GET /api/get_credentials`**: Fetches all credentials.
*   **`POST /api/add_credential`**: Adds a new credential. (Auth required)
*   **`PUT /api/update_credential/{credential_id}`**: Updates a credential. (Auth required)
*   **`DELETE /api/delete_credential/{credential_id}`**: Deletes a credential. (Auth required)

#### Partners
*   **`GET /api/get_partner_logos`**: Fetches all partners.
*   **`POST /api/add_partner`**: Adds a new partner. (Auth required)
*   **`PUT /api/update_partner/{partner_id}`**: Updates a partner. (Auth required)
*   **`DELETE /api/delete_partner/{partner_id}`**: Deletes a partner. (Auth required)

#### Contacts
*   **`POST /api/save-contact`**: Saves a submitted contact inquiry form payload to the database.
*   **`GET /api/get-contacts`**: Fetches all submitted contact messages. (Auth required)
*   **`DELETE /api/delete-contact/{contact_id}`**: Deletes a specific contact message from the inbox. (Auth required)

#### Media Upload
*   **`POST /api/upload-media`**: Receives an uploaded file, streams it directly to Vercel Blob storage, and returns the public HTTP URL. (Auth required)

## 4. Database (PostgreSQL on Vercel)

### 4.1. Connection

*   **Environment Variable:** The database connection string is provided via the `POSTGRES_URL` environment variable.
*   **Python Driver:** The `pg8000` library is used with SQLAlchemy to connect to the database.

### 4.2. Schema

*   **`users` table (New):**
    *   `id` (Integer, Primary Key)
    *   `username` (String, Unique): The username for logging in.
    *   `password_hash` (String): The user's password, hashed with bcrypt.
*   **`projects` table:** (Fields for title, category, location, description, etc.)
*   **`credentials` table:**
    *   `id` (Integer, Primary Key)
    *   `image_url` (String): Path to a credential image.
*   **`partners` table:**
    *   `id` (Integer, Primary Key)
    *   `name` (String): Partner's name.
    *   `logo_url` (String): Path to the partner's logo image.

### 4.3. Data Management Scripts

*   **`setup_database.py` (New):**
    *   **Purpose:** Initializes the production PostgreSQL database.
    *   **Functionality:** Connects to the database using the `POSTGRES_URL`, creates the `users`, `credentials`, and `partners` tables if they don't exist, and creates the initial `admin` user with a hashed password.
    *   **Usage:** This script must be run once (e.g., from your local machine) to prepare the production database before the application can be used.

## 5. Deployment and Configuration

### 5.1. Vercel Configuration (`vercel.json`)

The `vercel.json` file has been rewritten to support the new consolidated backend and React frontend.

*   **`builds`**: Defines two build steps:
    1.  `"src": "api/index.py"`: Specifies that the single `api/index.py` file should be deployed as a Python serverless function.
    2.  `"src": "package.json"`: Specifies that the frontend is a static build (React), with the output located in the `dist` directory.
*   **`routes`**: Manages incoming requests:
    1.  `"src": "/api/(.*)", "dest": "api/index.py"`: Routes all requests starting with `/api/` to the single FastAPI application.
    2.  `"handle": "filesystem"`: Allows Vercel to serve static files (like JS, CSS, images) from the `dist` directory directly.
    3.  `"src": "/(.*)", "dest": "/index.html"`: Acts as a fallback, routing all other requests to `index.html`. This allows the React single-page application to handle its own client-side routing.

### 5.2. Environment Variables

These must be set in the Vercel project settings.

*   **`POSTGRES_URL`**: The connection string for the Vercel PostgreSQL database.
*   **`SECRET_KEY`**: A long, random, and secret string used to sign the JWTs for authentication.
*   **`RESEND_API_KEY`**: API key for the Resend email service.
*   **`BLOB_READ_WRITE_TOKEN`**: Token for Vercel Blob storage access.

### 5.3. SEO, Crawling & Metadata

To optimize search engine indexing (Google rankings) and social share previews, several configuration setups are integrated:

*   **Dynamic Head Manager (`useSEO.js`)**: A custom React hook that dynamically modifies the browser tab title, description meta tags, keywords, and OpenGraph/Twitter card tags depending on the active SPA route.
*   **Structured JSON-LD Schema Data**: A `ProfessionalService` JSON-LD schema script is injected inside `index.html` to declare the company's verified alternate name (Arabic), address, logo, telephone, and URL details directly to Google crawlers for Rich Snippets.
*   **Sitemap Configuration (`sitemap.xml`)**:
    *   **Location:** `public/sitemap.xml` (served directly at `https://ososalbnaa.com/sitemap.xml`).
    *   **Purpose:** Maps all active indexable routes (`/`, `/about`, `/services`, `/projects`, `/credentials`, `/our-locations`) with change frequencies and crawling priority weights.
*   **Crawler Instructions (`robots.txt`)**:
    *   **Location:** `public/robots.txt` (served at `https://ososalbnaa.com/robots.txt`).
    *   **Purpose:** Permits general site indexing while explicitly instructing search engines not to crawl private folders like `/admin` and `/login`. Points bots to the sitemap XML URL.
*   **Google Search Console**: Verified using the HTML file verification method (`public/google0f3cee0ba0987c40.html`).
