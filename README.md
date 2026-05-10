# EditBridge

EditBridge is a production-minded MVP marketplace where content creators can discover vetted video editors, request projects, and collaborate through private project rooms.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Socket.io client
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt
- Uploads: Cloudinary
- Real-time: Socket.io

## Features

- Role-based authentication for clients, editors, and admins
- Approved editor marketplace with profile, portfolio, filters, and search
- Project request flow with reference links and optional voice notes
- Private project chat rooms with files, audio notes, timestamps, and status updates
- Simple anti-bypass moderation for emails, phone numbers, and social/contact handles
- Admin dashboard for approvals, user management, projects, reports, and flagged messages

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Update `backend/.env` with MongoDB, JWT, and Cloudinary values.

4. Start both apps:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.
Backend runs at `http://localhost:5000`.

## Free Deployment

### 1. MongoDB Atlas

Create a free Atlas cluster, add a database user, and copy the Node.js driver connection string. Use a database name such as `editbridge`.

Set the Atlas network access rule to allow your Render backend. For a beginner-friendly free setup, Atlas commonly uses `0.0.0.0/0` while the database user password remains secret.

### 2. Cloudinary

Create a free Cloudinary account and copy:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### 3. Backend on Render

Create a free Render Web Service from this repository.

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`

Add these Render environment variables:

```bash
NODE_ENV=production
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/editbridge?retryWrites=true&w=majority
JWT_SECRET=use-a-long-random-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLIENT_URL=https://your-vercel-app.vercel.app
```

Render provides `PORT` automatically. The backend reads `process.env.PORT`.

### 4. Frontend on Vercel

Create a Vercel project using the `frontend` directory.

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

Add these Vercel environment variables:

```bash
VITE_API_URL=https://your-render-service.onrender.com/api
VITE_SOCKET_URL=https://your-render-service.onrender.com
```

After Vercel gives you the final URL, update Render's `CLIENT_URL` to that exact Vercel URL. If you use preview deployments too, `CLIENT_URL` accepts comma-separated origins.

### Production Smoke Test

After both deployments are live:

1. Open `https://your-render-service.onrender.com/health`.
2. Register a client account from the Vercel app.
3. Register an editor account and create an editor profile.
4. Approve the editor from an admin account.
5. Upload a portfolio item to Cloudinary.
6. Send a project request with a voice note.
7. Open the project chat on two browsers and confirm real-time messages.
8. Send a test message with an email address and confirm it is warned and blurred.

### Troubleshooting

- CORS error: make sure Render `CLIENT_URL` exactly matches the Vercel URL, including `https://`.
- MongoDB connection failed: verify the Atlas connection string, database user password, and Network Access rule.
- Upload failed: verify all three Cloudinary variables on Render.
- Chat not updating: verify `VITE_SOCKET_URL` points to the Render service origin, not `/api`.
- Nested route refresh fails: make sure `frontend/vercel.json` is deployed with the SPA rewrite.
- Render sleeps on free tier: first request after inactivity can be slow.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/editors`
- `GET /api/editors/:username`
- `PUT /api/editors/me/profile`
- `POST /api/editors/me/media`
- `POST /api/editors/me/portfolio`
- `PATCH /api/editors/:id/approval`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PATCH /api/projects/:id/status`
- `POST /api/messages/:projectId`
- `GET /api/admin/overview`
- `PATCH /api/admin/users/:id/status`

## Notes

- Payments and live calls are intentionally excluded from this MVP.
- Social links are stored only on private editor profiles and are not displayed publicly.
- Moderation warns and blurs suspected off-platform contact sharing without permanently blocking messages.
