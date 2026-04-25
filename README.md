# TechSphere | IT Services & SaaS Management Platform

TechSphere is a premier full-stack platform designed to securely manage IT services, client subscriptions, and support tickets seamlessly.

## Features

- **Dashboard Analytics**: Real-time insights and metrics.
- **Client Management**: Fully functional CRM for IT clients.
- **Service Catalog**: Manage available IT services and SaaS products.
- **Ticketing System**: Track support requests seamlessly.
- **Role-Based Access Control**: Secure routes for Admins and Clients.
- **Intelligent Assistant**: Gemini AI-powered web helper.

## Tech Stack

| Domain | Technology | Use Case |
| ------------- | ------------- | ------------- |
| Frontend | React, Vite, Tailwind CSS | UI interface, routing, styling |
| Backend | Node.js, Express | REST API, robust server |
| Database | MongoDB, Mongoose | NoSQL persistent storage |
| Authentication | Passport.js, Google OAuth | Secure user login |
| Storage | Vercel (UI), Render (API) | Cloud infrastructure |

## Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/priynshu30/techsphere.git
cd techsphere
```

### 2. Install dependencies
Frontend:
```bash
npm install
```
Backend:
```bash
cd server
npm install
```

### 3. Environment Variables
Create `.env` files in both the root and `server/` directories. See below for the variables required.

### 4. Run Development Servers
Start both servers from the root directory:
```bash
npm run dev
npm run dev:server
```

## Environment Variables

### Frontend (`/.env`)
- `VITE_API_BASE_URL`: URL to your backend API (e.g. `http://localhost:5000/api`)
- `VITE_GEMINI_API_KEY`: API key for Gemini assistant

### Backend (`/server/.env`)
- `PORT`: 5000 (Local port)
- `MONGO_URI`: `mongodb+srv://...` (Your MongoDB Atlas connection string)
- `JWT_SECRET`: Secure string for hashing
- `JWT_EXPIRES_IN`: e.g. `7d`
- `GOOGLE_CLIENT_ID`: OAuth client id
- `GOOGLE_CLIENT_SECRET`: OAuth secret
- `NODE_ENV`: `development` or `production`

## API Endpoints Configuration

| Endpoint | Method | Description | Auth Required |
| ------------- | ------------- | ------------- | ------------- |
| `/api/health` | GET | Check server uptime | No |
| `/api/auth/google` | GET | Initiate Google Login | No |
| `/api/clients` | GET/POST | Fetch/create clients | Yes |
| `/api/services` | GET/POST | Fetch/create services | Yes |
| `/api/tickets` | GET/POST | Manage support tickets | Yes |

## Deployment Guide

### 1. MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to Data Access -> Add a User and configure basic authentication.
3. Go to Network Access -> Add IP Address. Whitelist `0.0.0.0/0` to allow Render access.
4. Retrieve the connection string.

### 2. Frontend Deployment (Vercel)
1. Push your code to GitHub.
2. Sign in to Vercel and import your repository.
3. Ensure the Build Command is `npm run build` and Output Directory is `dist`.
4. Add the `VITE_API_BASE_URL` pointing to your Render backend URL.
5. Deploy.

### 3. Backend Deployment (Render)
1. Sign in to Render and create a new "Web Service".
2. Connect your GitHub repository.
3. Set the Root Directory to `server`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables including `NODE_ENV=production` and `MONGO_URI`.
7. Deploy.

## Final Submission Checklist

- [ ] Live frontend URL (Vercel)
- [ ] Live backend URL (Render)
- [x] GitHub repository linked (`https://github.com/priynshu30/techsphere`)
- [x] API fully optimized and secured
- [x] React optimizations included (Lazy loading, meta SEO)

---
*Developed by Priyanshu*
