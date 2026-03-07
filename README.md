# Expense Tracker
⚠️ This project is currently under development.

A full-stack expense tracking application built with **Spring Boot** (backend) and **React + Vite** (frontend).

## Features

- Add, view, and manage expenses
- Categorize expenses
- Data persistence via CSV file storage
- REST API backend

## Tech Stack

**Backend**
- Java + Spring Boot
- Maven
- CSV file storage via `FileHandler`

**Frontend**
- React
- Vite
- JavaScript (JSX)

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Maven

### Backend
- Java 17+ + Spring Boot 4.0.2
- CSV file storage via `FileHandler` (`expenses.csv`)
- Maven

### Run the Backend

```bash
./mvnw spring-boot:run
```

Backend starts at `http://localhost:8080`.  
API available at `http://localhost:8080/api/expenses`.

### Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`.
