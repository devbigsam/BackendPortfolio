# Portfolio Backend Setup Guide

## Prerequisites
- Node.js installed
- MongoDB Atlas account (free tier)

## Step 1: Set Up MongoDB Atlas (Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user (username/password)
5. In Network Access, allow access from anywhere (0.0.0.0/0)
6. Get your connection string (click Connect → Connect your application)
7. Replace `MONGODB_URI` in `.env` file with your connection string

## Step 2: Configure Environment Variables

Edit `server/.env`:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=any_random_string_here
PORT=5000
```

## Step 3: Install and Run Backend

```bash
cd server
npm install
npm start
```

The backend will run on http://localhost:5000

## Step 4: Create Admin Account

After the server is running, create your admin account by sending a POST request:

```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourdomain.com","password":"yourpassword"}'
```

Or use a tool like Postman.

## Step 5: Run Frontend

In a new terminal:
```bash
cd samuelportfolio
npm install
npm run dev
```

## Step 6: Access Admin Panel

1. Go to http://localhost:5173/admin
2. Login with your admin credentials
3. You'll be redirected to /dashboard

## Deployment

### Backend (Render/Railway):
1. Push your code to GitHub
2. Connect to Render or Railway
3. Set environment variables (MONGODB_URI, JWT_SECRET)
4. Deploy

### Frontend (Vercel):
1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variable: VITE_API_URL=your_backend_url
4. Deploy

## Features

- **/admin** - Login page
- **/dashboard** - Main admin panel
- **/dashboard/projects** - Manage projects (add, edit, delete, toggle coming soon)
- **/dashboard/hero** - Edit hero section (name, title, description, skills)
- **/dashboard/skills** - Manage skills categories and skills
- **/dashboard/experience** - Manage experience entries
- **/dashboard/education** - Manage education entries
- **/dashboard/settings** - Global settings (coming soon mode)

## API Endpoints

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project (auth required)
- `PUT /api/projects/:id` - Update project (auth required)
- `DELETE /api/projects/:id` - Delete project (auth required)

- `GET /api/hero` - Get hero data
- `PUT /api/hero` - Update hero (auth required)

- `GET /api/skills` - List skill categories
- `POST /api/skills` - Create category (auth required)
- `PUT /api/skills/:id` - Update category (auth required)
- `DELETE /api/skills/:id` - Delete category (auth required)

- `GET /api/experience` - List experience
- `POST /api/experience` - Create experience (auth required)
- `PUT /api/experience/:id` - Update experience (auth required)
- `DELETE /api/experience/:id` - Delete experience (auth required)

- `GET /api/education` - List education
- `POST /api/education` - Create education (auth required)
- `PUT /api/education/:id` - Update education (auth required)
- `DELETE /api/education/:id` - Delete education (auth required)

- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings (auth required)

- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Create admin account (first admin only)
- `GET /api/admin/check` - Check if admin exists
