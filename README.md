# Expense Tracker
A full-stack expense tracking application built with **Spring Boot** (backend) and **React + Vite** (frontend).

## Features
- Add, edit, delete and view expenses
- Categorize expenses (Food, Travel, Rent, Shopping, Utilities, Entertainment, Other)
- Search expenses by name
- Pie chart showing this month's expenses by category
- Total spent this month summary
- Data persistence via PostgreSQL (H2 for quick setup)
- REST API backend with input validation

## Tech Stack

**Backend**
- Java 17+ + Spring Boot 4.0.2
- Spring Data JPA + Hibernate
- PostgreSQL (production) / H2 (default)
- Bean Validation
- Maven

**Frontend**
- React + Vite
- Recharts (pie chart)
- Axios

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Maven

### Run the Backend (H2 - no setup needed)
```bash
./mvnw spring-boot:run
```
Backend starts at `http://localhost:8080`

### Run the Backend (PostgreSQL - for persistent storage)
1. Install PostgreSQL
2. Create a database called `expense_tracker`
3. Create `src/main/resources/application-local.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/expense_tracker
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
```
4. Run with local profile in IntelliJ — set Active Profile to `local`

### Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend starts at `http://localhost:5173`

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/expenses | Get all expenses |
| POST | /api/expenses | Add expense |
| PUT | /api/expenses/{id} | Edit expense |
| DELETE | /api/expenses/{id} | Delete expense |
| GET | /api/expenses/by-month | Get this month's expenses |
| GET | /api/expenses/search?name= | Search expenses by name |
| GET | /api/expenses/spent-this-month | Get total spent this month |