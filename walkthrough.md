# Walkthrough - Codebase Improvements & Vercel Routing Resolutions

This walkthrough summarizes the refactoring changes completed to optimize security, architecture, performance, database maintenance, and to resolve the Vercel deployment routing conflicts.

---

## Changes Made

### 1. Security Enhancements
*   **Token Isolation**: Modified `upload_media.py` and `upload_simple.py` to retrieve keys from environment variables (`BLOB_READ_WRITE_TOKEN`, `VERCEL_API_TOKEN`) rather than hardcoded string parameters.
*   **Active Session Validation**: Updated [App.jsx](file:///d:/Courses/Web%20Project/Osos%20Project/osos-engineering-enhanced/osos-react-app/src/App.jsx) to validate JWT authorization signatures and check expiry claims on mount using standard base64 payload parsing.
*   **Token Expiry Redirection**: Integrated a 401 interceptor hook inside [AdminPanel.jsx](file:///d:/Courses/Web%20Project/Osos%20Project/osos-engineering-enhanced/osos-react-app/src/AdminPanel.jsx) that automatically logs out users, clears cache, and routes them to `/login` if their admin session expires.

### 2. Architectural Consolidation
*   **Unified Python Backend API**: Ported the Node.js `api/save-contact.js` file into a clean FastAPI router in `api/contacts.py` and deleted the old Node files (`save-contact.js` and `send-email.js`).
*   **Simplified Routing**: Rewrote `vercel.json` to remove the Node compiler step and route all `/api` traffic directly to the Python FastAPI entry point.
*   **Directory Cleanup**: Merged duplicate asset folders from `frontend/public` to root `public/`, deleted the legacy `frontend` folder, and updated [vite.config.js](file:///d:/Courses/Web%20Project/Osos%20Project/osos-engineering-enhanced/osos-react-app/vite.config.js) to use default paths.

### 3. Database & Code Cleanups (SQLAlchemy ORM)
*   **ORM Model Definitions**: Created a new declarative models module in [models.py](file:///d:/Courses/Web%20Project/Osos%20Project/osos-engineering-enhanced/osos-react-app/api/models.py) mapping database tables to SQLAlchemy types.
*   **FastAPI Controller Modernization**: Refactored the core FastAPI routers ([index.py](file:///d:/Courses/Web%20Project/Osos%20Project/osos-engineering-enhanced/osos-react-app/api/index.py), [about_us.py](file:///d:/Courses/Web%20Project/Osos%20Project/osos-engineering-enhanced/osos-react-app/api/about_us.py), [services.py](file:///d:/Courses/Web%20Project/Osos%20Project/osos-engineering-enhanced/osos-react-app/api/services.py)) to query using clean SQLAlchemy ORM queries (e.g. `db.query(...)`) instead of executing raw database SQL text strings.
*   **Dynamic Landing Services**: Replaced the static mock `services` lists in [App.jsx](file:///d:/Courses/Web%20Project/Osos%20Project/osos-engineering-enhanced/osos-react-app/src/App.jsx) with dynamic API queries fetching records directly from the Postgres database.

### 4. UI/UX Refinements
*   **Eager Loading & Loading Skeletons**: Integrated an overlay skeleton loader in `src/Components/Carousel/Carousel.jsx` and configured the active image tag to load eagerly (`loading="eager"`). This resolved a browser deadlock where lazy-loaded images styled with `display: none` were never fetched, keeping the carousel spinner frozen. Added safety `onError` handlers to gracefully handle image/video loading errors.

### 5. Vercel Deployment & Routing Resolutions (CRITICAL)
*   **Size Constraint Exclusions**: Created a [.vercelignore](file:///d:/Courses/Web%20Project/Osos%20Project/osos-engineering-enhanced/osos-react-app/.vercelignore) file to exclude static public media folders from Vercel's serverless function compilation phase, reducing the Python function zip size from 244MB (exceeding Vercel's 225MB limit) to a lightweight 18.72MB.
*   **Vercel Configuration Correction**: Adjusted [vercel.json](file:///d:/Courses/Web%20Project/Osos%20Project/osos-engineering-enhanced/osos-react-app/vercel.json) to use clean legacy `builds` + `routes` (avoiding config-validator crashes caused by mixing legacy routes with modern redirects):
    - Routes `/api/(.*)` directly to the compiled serverless function `/api/index.py`.
    - Implements `{ "handle": "filesystem" }` to terminate routing once matched.
    - Cascades other paths `/(.*)` to `/index.html` as a fallback for React Router SPA navigation.
*   **ASGI Path Restoration Middleware**: Integrated a custom ASGI middleware `VercelPathMiddleware` in [api/index.py](file:///d:/Courses/Web%20Project/Osos%20Project/osos-engineering-enhanced/osos-react-app/api/index.py) to parse Vercel's Edge network `x-matched-path` header. This restores the original request path (e.g., `/api/get_credentials`) before passing it to FastAPI, resolving the "FastAPI 404 / index.html Fallback" loop.

---

## Verification Results

*   **Vercel CLI Local Validation**: Ran `vercel dev` local simulations, confirming that routing rules parse and bind correctly without configuration conflicts.
*   **Vercel Deployment Protection Bypass**: Verified that preview deployment URLs return Vercel's Deployment Protection Login page (`X-Matched-Path: /login`) due to Pro account protection, which is bypassed in client browsers once logged into Vercel.
*   **Production API Live Verification**: Queried the live production domain (`https://osos-react-v4.vercel.app`), verifying that:
    - `/api/get_credentials` returns status code `200` and the correct credentials JSON payload.
    - `/api/get_projects` returns status code `200` and the correct projects JSON payload.
    - Data loads correctly from the database, resolving the empty pages issue!
