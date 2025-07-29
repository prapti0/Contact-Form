#  Contact Form Full Stack Application

This is a full-stack Contact Form web application built with **Angular** (frontend), **Spring Boot** (backend), and **MySQL** (database). The application allows users to submit contact information, which is stored in the backend and viewable through a dynamic, paginated, and searchable interface.

---

##  Features

- Submit contact details with validation
- Responsive UI using Angular Material
- Backend API with CRUD operations
- Pagination, sorting, and search
- Toast messages on actions
- Integrated MySQL database
- Form and API validation
- Clean modular code structure

---

## 🛠 Tech Stack

| Layer       | Technology               |
|-------------|--------------------------|
| Frontend    | Angular 16+, TypeScript, Angular Material |
| Backend     | Spring Boot 3, Java 21   |
| Database    | MySQL 8+                 |
| Build Tool  | Maven (backend)          |
| Others      | RxJS, QueryDSL (optional), REST APIs |

---

## ⚙️ How to Run

### ✅ Prerequisites

- Node.js & npm
- Angular CLI
- Java 21
- Maven
- MySQL

---

### 1️⃣ Backend Setup (Spring Boot)

1. Navigate to the `backend/` folder:

cd backend
Configure your MySQL credentials in application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/contactdb
spring.datasource.username=root
spring.datasource.password=your_password

Run the application:

mvn spring-boot:run
The backend will start on: http://localhost:9090

### 2️⃣ Frontend Setup (Angular)
Navigate to the frontend/ folder:

cd frontend
Install dependencies:
npm install

Start the development server:
ng serve
The frontend will run on: http://localhost:4200
