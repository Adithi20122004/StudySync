# 📚 StudySync

Organize. Track. Never Miss a Deadline.

---

## ✨ Features

- 🔐 **Authentication** — Secure register/login with JWT
- 📊 **Dashboard** — Real-time stats, upcoming deadlines, and workload chart
- 📝 **Task Board** — Kanban board with drag-and-drop (To Do, In Progress, Review, Done)
- 📅 **Calendar** — Monthly view with tasks plotted by due date
- 👥 **Groups** — Create study groups, add members by email, assign group tasks
- 📚 **Resources** — Save and organize links/resources by subject
- 🔔 **Notifications** — Bell icon alerts for overdue and upcoming tasks

---

## 🛠 Tech Stack

**Frontend**
- React + Vite
- React Router DOM
- Custom CSS design system

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

---


### 1. Clone the repo
```bash
git clone https://github.com/Adithi20122004/studysync-mern.git
cd studysync-mern
```

### 2. Setup the server
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:
```bash
node index.js
```

### 3. Setup the client
```bash
cd client
npm install
npm run dev
```

---

## 📁 Project Structure

```
studysync-mern/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Layout, Dashboard, Tasks
│       ├── pages/          # Dashboard, Tasks, Calendar, Groups, Resources
│       └── services/       # API calls
│
└── server/                 # Express backend
    ├── controllers/        # Auth, Tasks
    ├── middleware/         # JWT auth middleware
    ├── models/             # User, Task, Group, Resource
    └── routes/             # API routes
```

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |

---

## 📸 Demo

https://github.com/user-attachments/assets/27a49827-8dbc-41ec-8b77-304b6e58974a

