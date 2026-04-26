# Student Counselling Management System

A full-stack, production-ready Student Counselling Management System built using the MERN stack (MongoDB, Express, React, Node.js). This platform enables students to book appointments, counselors to manage sessions and confidential notes, and administrators to oversee system activity.

## Features

- **User Roles & Authentication**: Secure sign-in and registration for Students, Counselors, and Administrators using JWT.
- **Student Dashboard**: 
  - Manage personal profile and information.
  - Browse available counselors and book appointments.
  - View upcoming and past counseling sessions.
- **Counselor Dashboard**:
  - View filtered lists of appointments and completed sessions.
  - Interactive navigation for managing daily schedules.
  - View student profile details directly within the appointment dashboard.
  - Manage confidential session notes.
- **Admin Dashboard**: Oversee system activity, users, and overall management.
- **Real-time Features**: Integrated with Socket.io for potential real-time notifications or chat.

## Tech Stack

### Frontend
- React 19 (via Vite)
- Tailwind CSS & Autoprefixer (Styling)
- React Router DOM (Routing)
- Axios (API Requests)
- Lucide React (Icons)
- Sonner (Toast notifications)

### Backend
- Node.js & Express.js
- MongoDB & Mongoose (Database & ODM)
- JSON Web Token (JWT) & bcryptjs (Authentication & Security)
- Socket.io (Real-time communication)
- Multer (File uploads, e.g., profile pictures)
- Nodemailer (Email services)

## Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (Local instance or MongoDB Atlas cluster)
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd student_c_m
```

### 2. Install Dependencies

Install the root dependencies (which include `concurrently` for running both servers):
```bash
npm install
```

Install backend dependencies:
```bash
cd Backend
npm install
cd ..
```

Install frontend dependencies:
```bash
cd Frontend
npm install
cd ..
```

### 3. Environment Variables

Create `.env` files in both the `Backend` and `Frontend` directories as needed. 

**Backend (`Backend/.env`) Example:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_counselling_db # Or your MongoDB Atlas connection string
JWT_SECRET=your_jwt_secret_key
```

### 4. Running the Application

You can start both the frontend and backend servers simultaneously from the root directory using:

```bash
npm run dev
```

Alternatively, you can run them separately:
- **Backend only**: `npm run server`
- **Frontend only**: `npm run client`

The frontend will typically run on `http://localhost:5173` (Vite default) and the backend on the port specified in your `.env` (e.g., `http://localhost:5000`).

## Project Structure

```
student_c_m/
├── Backend/                 # Express/Node.js Server
│   ├── controllers/         # Request handlers
│   ├── routes/              # API routes
│   ├── models/              # Mongoose database models
│   ├── server.js            # Entry point for backend
│   └── package.json
├── Frontend/                # React/Vite Client Application
│   ├── src/
│   │   ├── pages/           # React component pages (admin, student, counselor)
│   │   ├── components/      # Reusable UI components
│   │   └── App.jsx
│   └── package.json
├── package.json             # Root package.json (concurrently scripts)
└── README.md
```
