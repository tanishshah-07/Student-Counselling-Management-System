# Technical Architecture Diagram

## System Architecture: Student Counselling Management System

```mermaid
graph TD
    subgraph CLIENT["🖥️ Client Layer (React + Vite)"]
        direction LR
        SA["Student Dashboard"]
        CA["Counselor Dashboard"]
        AA["Admin Dashboard"]
        AUTH_PAGE["Login / Register Page"]
    end

    subgraph FRONTEND_INFRA["Frontend Infrastructure"]
        direction LR
        RR["React Router DOM"]
        AX["Axios (HTTP Client)"]
        CTX["Auth Context / Hooks"]
    end

    subgraph BACKEND["⚙️ Backend (Node.js + Express)"]
        direction TB
        SERVER["server.js (Entry Point)"]
        APP["app.js (Express App)"]

        subgraph MIDDLEWARE["Middleware Layer"]
            CORS["CORS"]
            COOKIE["Cookie Parser"]
            AUTH_MW["Auth Middleware (JWT Verify + Role Check)"]
            ERR_MW["Error Handler"]
        end

        subgraph ROUTES["API Routes"]
            R1["/api/auth"]
            R2["/api/counselors"]
            R3["/api/appointments"]
            R4["/api/admin"]
            R5["/api/upload"]
        end

        subgraph CONTROLLERS["Controllers"]
            C1["authController\n(login, register, logout)"]
            C2["counselorController\n(list, profile)"]
            C3["appointmentController\n(book, update, list)"]
            C4["adminController\n(users, stats)"]
        end

        subgraph SERVICES["Services & Utils"]
            direction LR
            MAILER["Nodemailer\n(Email Service)"]
            MULTER["Multer\n(File Uploads)"]
            SOCKET["Socket.io\n(Real-time)"]
        end
    end

    subgraph DB_LAYER["🗄️ Data Layer (MongoDB Atlas)"]
        direction LR
        M_USER["Users Collection"]
        M_COUNSEL["Counselors Collection"]
        M_APPT["Appointments Collection"]
        M_SESSION["SessionRecords Collection"]
    end

    %% Client → Frontend Infra
    AUTH_PAGE --> CTX
    SA & CA & AA --> RR
    RR --> AX
    CTX --> AX

    %% Frontend → Backend
    AX -->|"HTTP REST API (JSON)"| APP

    %% Backend Internal
    SERVER --> APP
    APP --> CORS --> COOKIE --> AUTH_MW
    AUTH_MW --> R1 & R2 & R3 & R4 & R5
    R1 --> C1
    R2 --> C2
    R3 --> C3
    R4 --> C4
    R5 --> MULTER

    %% Controllers → DB
    C1 & C2 & C3 & C4 -->|"Mongoose ODM"| DB_LAYER
    C1 --> M_USER
    C2 --> M_COUNSEL
    C3 --> M_APPT & M_SESSION
    C4 --> M_USER & M_APPT

    %% Side services
    C1 -.->|"Send welcome / reset email"| MAILER
    C3 -.->|"Real-time notifications"| SOCKET

    %% Error Handler
    C1 & C2 & C3 & C4 --> ERR_MW

    %% Styles
    style CLIENT fill:#1e3a5f,color:#fff,stroke:#3b82f6
    style FRONTEND_INFRA fill:#1e3a5f,color:#fff,stroke:#3b82f6
    style BACKEND fill:#1a3329,color:#fff,stroke:#22c55e
    style MIDDLEWARE fill:#1f2d1e,color:#d1fae5,stroke:#4ade80
    style ROUTES fill:#1f2d1e,color:#d1fae5,stroke:#4ade80
    style CONTROLLERS fill:#1f2d1e,color:#d1fae5,stroke:#4ade80
    style SERVICES fill:#1f2d1e,color:#d1fae5,stroke:#4ade80
    style DB_LAYER fill:#3b1f0f,color:#fff,stroke:#f97316
```

---

## Data Flow Explanation

| Step | Action |
|------|--------|
| 1 | User interacts with a React page (Login, Book Appointment, etc.) |
| 2 | **Axios** sends an HTTP request to the Express API (e.g., `POST /api/appointments`) |
| 3 | **CORS** middleware validates the request origin |
| 4 | **Auth Middleware** verifies the JWT from the cookie and checks the user's role |
| 5 | The request is forwarded to the appropriate **Controller** |
| 6 | The Controller runs business logic and communicates with **MongoDB** via Mongoose |
| 7 | For side-effects, the controller may trigger **Nodemailer** (emails) or **Socket.io** (real-time events) |
| 8 | The Controller returns a JSON response back to the React frontend |
| 9 | React updates state and re-renders the UI |

---

## MongoDB Collections (Data Schema Summary)

| Collection | Key Fields |
|---|---|
| `Users` | `_id`, `name`, `email`, `password (hashed)`, `role (student/counselor/admin)`, `profilePicture` |
| `Counselors` | `_id`, `user (ref)`, `specialization`, `availability`, `bio` |
| `Appointments` | `_id`, `student (ref)`, `counselor (ref)`, `date`, `status (pending/confirmed/completed)` |
| `SessionRecords` | `_id`, `appointment (ref)`, `notes (confidential)`, `createdAt` |
