# 🗂️ TaskProgress

TaskProgress is a fullstack task management application built with **Next.js** and **Express.js**.  
It helps users manage tasks efficiently with secure authentication, task tracking, and role-based access control.

---

## 🚀 Features

- 🔐 **Authentication**
  - Register & Login
  - JWT-based authentication
  - Password hashing with bcrypt

- 📝 **Task Management**
  - Create, read, update, delete tasks
  - Task status: To Do, In Progress, Done

- 👤 **Role-Based Access Control**
  - User & Admin roles
  - Users can only access their own tasks
  - Admin can manage all tasks

- 📊 **Modern UI**
  - Responsive layout
  - Clean dashboard interface

---

## 🧱 Tech Stack

### Backend (Express.js)

* Node.js
* Express.js
* nodemon
* dotenv
* cors
* MySQL2
* rate-limit
* cookie
* cookie-parser
* jwt
* sequelize
* bcrypt

### Frontend (Next.js)

* Next.js
* Axios
* Tailwind CSS
* DaisyUi
* motion

# 🐳 Docker Setup (Recommended)

## 📦 Prerequisites
* Docker
* Docker Compose

## ▶️ Run with Docker Compose
```bash
docker-compose up --build
```
or 
```bash
docker-compose up -d --build
```

## 🌐 Services
| Service | URL |
|------|------------|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000 |
| Database | localhost:3306 |

## 🛑 Stop Containers
```bash
docker-compose down
```

## ♻️ Rebuild Containers
```bash
docker-compose down
docker-compose up --build
```

# ⚙️ Backend (Express.js)

## 📦 Installation

```bash
cd backend
npm install
```

## 🔑 Environment Variables

Create a `.env` file in the `backend` folder:

## ▶️ Run the Server

```bash
npm run dev
# or
npm start
```

The server will run at:

```
http://localhost:5000
```

# 🎨 Frontend (Next.js)

## 📦 Installation

```bash
cd frontend
npm install
```

## ▶️ Run the Application

```bash
npm run dev
```

The app will run at:

```
http://localhost:3000
```

## ✨ Author

Created by **MrAgungS**

Feel free to fork, use, and improve this project 🚀