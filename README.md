# Online Learning Portal Frontend

## Backend Connection

The frontend is configured to call the backend through Vite proxy during local development.

1. Create a local env file from `.env.example`.
2. Start the backend on `http://localhost:8000` or change `VITE_BACKEND_TARGET`.
3. Run the frontend with `npm run dev`.

Default settings:

```env
VITE_API_BASE_URL=/api
VITE_BACKEND_TARGET=http://localhost:8000
```

Auth requests used by the frontend:

- `POST /api/token/`
- `POST /api/token/refresh/`
- `POST /api/auth/register/`

The app stores `access_token`, `refresh_token`, `user_role`, and `user_name` in `localStorage` so the session persists after refresh.
