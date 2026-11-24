# Healthcare AI

Healthcare AI is a responsive React frontend connected to a Spring Boot API. Authentication, doctor listings, appointment booking, reports, and dashboard data use the backend when available. Dashboard, appointment, and report screens show mock data with a notice when those services are unavailable.

## Run locally

Configure the backend URL in `.env` (defaults to `http://localhost:1234`), then start the frontend:

```sh
npm install
npm run dev
```

`.env.example` contains the expected frontend configuration. Restart Vite after changing environment variables.

## Available checks

```sh
npm run lint
npm run build
```

## API integration notes

- The frontend expects the auth response fields `token`, `userId`, `name`, `email`, and `role`.
- Doctor list responses may be an array or `{ "data": [] }`.
- Patient and doctor registration use separate endpoints. Doctor registrations remain hidden from the public directory and cannot log in until an administrator approves them.
- The backend creates `admin@docai.com` once when `APP_ADMIN_PASSWORD` is configured; the password is stored as BCrypt. Sign in at `/admin/login`. In Eclipse, open **Run Configurations → Java Application → DocAiApplication → Environment**, add `APP_ADMIN_EMAIL` (or leave it unset for the default email) and `APP_ADMIN_PASSWORD`, then restart the backend. Do not commit administrator credentials.
- TODO comments mark appointment, report, and dashboard field mappings that need confirmation against the backend Swagger/DTOs.
- Medical history and AI analysis service methods are available; their UI integrations await confirmed request and response schemas.
- Do not enter real patient information in demo fallback paths.
