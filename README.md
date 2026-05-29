# UniLearn Academy - Online Learning Portal

A premium, modern online learning platform frontend built with React, Vite, and Tailwind CSS.

## Get Started

Follow these steps to set up the project on your machine:

### 1. Prerequisites
- **Node.js**: Version 18.0 or higher (Recommended: v20 LTS)
- **npm**: v9.0 or higher

### 2. Installation
Clone the repository and install the dependencies:
```bash
# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and configure your backend endpoint:
```bash
# For Windows
copy .env.example .env

# For macOS/Linux
cp .env.example .env
```

Default configuration in `.env`:
```env
VITE_API_BASE_URL=/api
VITE_BACKEND_TARGET=http://localhost:8000
```

### 4. Running the App
Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## Project Structure

- `src/components`: UI components organized by features (Cart, Course, Profile, etc.)
- `src/services`: API service layers and Axios configuration.
- `src/context`: React Context for state management (Auth, Cart).
- `src/assets`: Static assets and global styles.

## Backend Integration

The frontend connects to a Django/Python backend. During development, Vite's Dev Server proxies requests starting with `/api` to the URL specified in `VITE_BACKEND_TARGET` to avoid CORS issues.

**Required Authentication Data (Stored in LocalStorage):**
- `access_token`
- `refresh_token`
- `user_role` (student/instructor/admin)
- `user_name`

## Scripts
- `npm run dev`: Starts the development server.
- `npm run build`: Build for production.
- `npm run preview`: Locally preview the production build.
- `npm run lint`: Run ESLint for code quality checks.

---
*Developed for UniLearn Academy.*
