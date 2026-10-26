# Course Feedback Admin Panel

A full-stack MERN application for managing course feedback records. This repository keeps the frontend and backend in separate folders so they can run independently while remaining in the same project.

## Features

- Node.js + Express backend with MongoDB Atlas + Mongoose support
- Full CRUD API for course feedback records
- Required field and rating validation with clear errors
- React and React Router frontend with a modern responsive dashboard
- Dashboard and Add Feedback navigation tabs
- Update and delete flows with confirmation and prefilled forms
- Environment-based configuration for both frontend and backend

## Project structure

```text
course-feedback-admin-panel/
├── backend/
│   ├── .env.example
│   ├── models/
│   │   └── Feedback.js
│   ├── routes/
│   │   └── feedbackRoutes.js
│   ├── package.json
│   ├── server.js
│   └── .env              # local only, not committed
├── frontend/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       ├── index.css
│       └── main.jsx
├── .gitignore
├── README.md
└── package.json (optional root-level script wrapper)
```

## Backend setup

1. Go to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a local environment file:

```bash
cp .env.example .env
```

4. Edit `.env` and add your MongoDB Atlas connection string and port:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/course-feedback-db?retryWrites=true&w=majority
```

5. Start the backend:

```bash
npm run dev
```

The backend runs on `http://localhost:5000` by default.

## Frontend setup

1. Go to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create the local frontend environment file:

```bash
cp .env.example .env
```

4. Update the API base URL if needed:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

5. Start the frontend:

```bash
npm run dev
```

The frontend will typically run at `http://localhost:5173`.

## API routes

Base URL: `http://localhost:5000/api`

- `GET /api/health` - API health check
- `GET /api/feedback` - Get all feedback entries
- `POST /api/feedback` - Create new feedback
- `PUT /api/feedback/:id` - Update existing feedback
- `DELETE /api/feedback/:id` - Delete feedback by id

## Feedback model fields

Each feedback entry contains:

- `courseId`
- `courseName`
- `courseDuration`
- `comments`
- `rating`
- `createdAt`
- `updatedAt`

## MongoDB Atlas configuration

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a cluster and database user
3. Add a strong password and save your connection string
4. Allow your IP address in the Atlas network access settings
5. Add the connection string to `backend/.env`
6. Never commit live credentials or secrets to Git

## Notes

- Required fields are validated on both the backend and form level.
- Ratings must be between 1 and 5.
- Delete actions require confirmation before removing records.
- The dashboard shows loading, empty, and error states.
- The frontend can be configured independently via `.env`.

## Security

- Real `.env` files are not committed.
- Example `.env` files use placeholders only.
- Do not place production or personal database credentials in the repository.
