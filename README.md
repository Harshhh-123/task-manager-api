# Task Manager API

A RESTful API for task management built with Node.js, Express, PostgreSQL, and MongoDB.

## Tech Stack
- Node.js + Express.js
- PostgreSQL (via Sequelize) — user data
- MongoDB (via Mongoose) — task data
- JWT authentication
- bcryptjs for password hashing
- Joi for validation

## Setup Instructions

1. Clone the repo:
   git clone https://github.com/Harshhh-123/task-manager-api.git
   cd task-manager-api

2. Install dependencies:
   npm install

3. Create .env file with:
   PORT=3000
   PG_HOST=localhost
   PG_PORT=5432
   PG_USER=postgres
   PG_PASSWORD=yourpassword
   PG_DATABASE=taskmanager
   MONGO_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=supersecretkey123
   JWT_EXPIRES_IN=7d

4. Create PostgreSQL database:
   psql -U postgres -c "CREATE DATABASE taskmanager;"

5. Run the server:
   npm run dev

## API Endpoints

### Auth
- POST /api/auth/register — Register user
- POST /api/auth/login — Login, returns JWT
- GET /api/auth/me — Get profile (auth required)

### Tasks (all require Bearer token)
- POST /api/tasks — Create task
- GET /api/tasks — Get all tasks
- GET /api/tasks/:id — Get task by ID
- PATCH /api/tasks/:id — Update task
- DELETE /api/tasks/:id — Delete task

## Folder Structure
src/
  config/       — DB connections
  middleware/   — auth, error handler
  modules/
    users/      — user model, controller, routes
    tasks/      — task model, controller, routes