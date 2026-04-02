# Important
```
The main focus is backend architecture and API design.
Frontend design is not the priority and is implemented as best as possible to support testing and usage of the backend.
```

# TaskProgress

TaskProgress was inspired by Google's Web Notes, so I decided to create my own simplified version, and I've completed the migration from Express to Nest. While it might not look much different, there are some improvements and new features.

---
# Docker Setup (Recommended)

## Prerequisites

- Docker
- Docker Compose

## Run with Docker Compose

```bash
docker-compose up --build
```

or

```bash
docker-compose up -d --build
```

## Stop Containers

```bash
docker-compose down
```

## Rebuild Containers

```bash
docker-compose down
docker-compose up --build
```

# Backend (Nest.js)

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file in the `backend` folder:

## Run the Server

```bash
npm start:dev
# or
npm start
```

The server will run at:

```
http://localhost:3030
```

# Frontend (Next.js)

## Installation

```bash
cd frontend
npm install
```

## Run the Application

```bash
npm run dev
```

The app will run at:

```
http://localhost:3000
```

## Author

Created by **MrAgungS**

Feel free to fork, use, and improve this project
