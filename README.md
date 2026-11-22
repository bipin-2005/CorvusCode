
# CorvusCode - Online Coding Challenge Platform

An online coding platform designed to help developers practice programming, solve algorithmic problems, and participate in coding challenges. CorvusCode provides an integrated coding environment with multi-language support, automated code execution, and contest management features.

![Status](https://img.shields.io/badge/Status-Active%20Development-success)
![React](https://img.shields.io/badge/React-TypeScript-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-Java-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Docker](https://img.shields.io/badge/Docker-Sandbox-2496ED)

## Features

### Implemented

- **User Authentication & Authorization**
  - Secure user registration and login
  - JWT-based authentication
  - Role-based access control
  - Protected routes and endpoints

- **Problem Management**
  - Browse programming problems
  - Problems categorized by difficulty (Easy, Medium, Hard)
  - Detailed problem descriptions and constraints
  - Starter code support
  - Test case management
  - Admin problem management

- **Online Code Editor & Submission**
  - Integrated Monaco code editor
  - Multi-language programming support
  - Submit solutions for evaluation
  - Submission status tracking
  - Execution results and verdict management

- **Multi-Language Support**
  - Java
  - Python
  - C++

- **Automated Code Execution (Judge Service)**
  - Docker-based code execution environment
  - Isolated execution for submitted programs
  - Automated test case evaluation
  - Execution time and memory constraints
  - Submission verdict processing

- **Contest Management**
  - Create and manage coding contests
  - Browse available contests
  - Join contests
  - Contest-specific problem management
  - Track contest participation

- **Admin Dashboard**
  - Problem management
  - Test case management
  - Contest management
  - Administrative controls

### Coming Soon

- Global leaderboard and rankings
- User profiles and achievement system
- Contest certificates (participation and winners)
- Advanced submission history and analytics
- Discussion forums for programming problems
- AI-powered coding assistant
- Code quality analysis
- More programming language support

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Monaco Editor** - Code editing environment
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Java** - Programming language
- **Spring Boot** - Backend framework
- **Spring Security** - Authentication and authorization
- **JWT** - Token-based authentication
- **Maven** - Dependency management

### Database
- **PostgreSQL** - Relational database

### Judge Service
- **Docker** - Containerized code execution
- **Java, Python, C++** - Supported execution languages

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- Java JDK installed
- Maven installed
- PostgreSQL installed and running
- Docker installed and running
- Git installed

### 1. Clone the Repository

```bash
git clone https://github.com/bipin-2005/CorvusCode.git
cd CorvusCode
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend development server will start at the URL displayed in the terminal.

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Start Spring Boot application
mvn spring-boot:run
```

The backend API runs on `http://localhost:8080`.

### 4. Judge Service Setup

```bash
# Navigate to judge-service directory
cd judge-service

# Build the project
mvn clean install

# Start the judge service
mvn spring-boot:run
```

### 5. PostgreSQL Setup

Make sure PostgreSQL is running on your system.

Create the database:

```sql
CREATE DATABASE corvuscode;
```

Configure your database credentials in the backend application configuration.

### 6. Docker Setup

Make sure Docker Desktop or Docker Engine is running before executing code submissions.

The judge service uses Docker-based isolation to execute submitted programs in a controlled environment.

## 📁 Project Structure

```text
CorvusCode/
├── frontend/                     # React + TypeScript frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Application pages
│   │   ├── services/              # API service layer
│   │   ├── context/               # Application context
│   │   ├── types/                 # TypeScript interfaces
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # Spring Boot backend
│   ├── src/main/java/
│   │   └── ...
│   │       ├── controller/       # REST controllers
│   │       ├── service/           # Business logic
│   │       ├── repository/        # Database operations
│   │       ├── entity/            # JPA entities
│   │       ├── security/          # JWT and security
│   │       └── config/            # Configuration
│   └── pom.xml
│
├── judge-service/                # Code execution service
│   ├── src/main/java/
│   │   └── ...
│   │       ├── executor/          # Language executors
│   │       ├── docker/            # Docker integration
│   │       └── service/           # Execution logic
│   └── pom.xml
│
└── README.md
```

## Screenshots

<table>
  <tr>
    <td align="center">
      <strong>Admin Dashboard</strong><br><br>
      <img src="https://github.com/user-attachments/assets/4d2cae37-4c85-4224-83c7-8d423bcbb50a" alt="Dashboard" width="100%">
    </td>
    <td align="center">
      <strong> Code Editor</strong><br><br>
      <img  src="https://github.com/user-attachments/assets/d5d17660-7c0f-48ab-a0a2-b4c3f7f88091" alt="Code Editor" width="100%">
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Contest Dashboard</strong><br><br>
      <img src="https://github.com/user-attachments/assets/e858aec9-c4fe-48c7-8154-1a3ad7eb6e01" alt="Contest Dashboard" width="100%">
    </td>
    <td align="center">
      <strong>Dashboard</strong><br><br>
      <img src="https://github.com/user-attachments/assets/45c87a24-98b4-4762-92c6-96861f98c154" alt="Admin Dashboard" width="100%">
    </td>
  </tr>
</table>

##  Usage

### Solving a Coding Problem

1. Register or log in to your CorvusCode account.
2. Navigate to the Problems section.
3. Browse available problems.
4. Select a problem based on its difficulty.
5. Read the problem description, constraints, and examples.
6. Write your solution using the integrated Monaco code editor.
7. Select your programming language (Java, Python, or C++).
8. Submit your solution for evaluation.
9. View the execution status and submission verdict.

### Participating in a Contest

1. Log in to your account.
2. Navigate to the Contests section.
3. Browse available coding contests.
4. Select a contest and join it.
5. Access the problems assigned to the contest.
6. Submit solutions within the contest duration.
7. Track your participation and submissions.

### Admin Operations

Administrators can:

- Create and manage programming problems.
- Configure problem difficulty and constraints.
- Add and manage test cases.
- Manage starter code.
- Create and manage contests.
- Assign problems to contests.

## 🔧 Configuration

### Frontend Environment Variables

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:8080/api
```

### Backend Configuration

Configure your database connection in the backend application properties:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/corvuscode
spring.datasource.username=your_username
spring.datasource.password=your_password

server.port=8080
```

Configure your JWT secret and other application-specific properties separately.

### Judge Service Configuration

Configure the judge service to communicate with the backend and Docker execution environment.

Ensure Docker is accessible and the required execution limits are configured.

##  API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user

### Problem Endpoints
- `GET /api/problems` - Get available problems
- `GET /api/problems/{slug}` - Get problem by slug
- `GET /api/problems/{id}` - Get problem by ID

### Contest Endpoints
- `POST /api/contests/{contestId}/participation/join` - Join a contest
- `GET /api/contests/{contestId}/participation/me` - Get participation details

### Submission Endpoints
- Submission creation and execution
- Submission status tracking
- Submission result retrieval

*Note: Refer to the respective controllers for the complete and latest API route definitions.*

##  Design Features

- **Modern UI:** Clean and developer-focused interface.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Code Editor:** Monaco Editor for an integrated coding experience.
- **Difficulty Indicators:** Easy, Medium, and Hard problem categorization.
- **Interactive Components:** Smooth navigation and user interactions.
- **Admin Interface:** Dedicated administrative functionality.

##  Deployment

### Frontend Deployment (Vercel)

```bash
cd frontend
npm install
npm run build
```

Deploy the generated `dist` directory using Vercel.

### Backend Deployment

```bash
cd backend
mvn clean package
java -jar target/*.jar
```

Configure PostgreSQL, environment variables, and production server settings before deployment.

### Judge Service Deployment

```bash
cd judge-service
mvn clean package
java -jar target/*.jar
```

Ensure Docker is installed and configured on the deployment environment.

##  Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

##  License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by online coding platforms like LeetCode and HackerRank.
- Built using modern web development technologies.
- Monaco Editor for the coding environment.
- Spring Boot for backend development.
- PostgreSQL for database management.
- Docker for isolated code execution.

## Contact

For questions or feedback, please open an issue on GitHub.

---

## Roadmap

- [x] User authentication and JWT security
- [x] Problem management
- [x] Starter code management
- [x] Test case management
- [x] Submission module
- [x] Contest management
- [x] Multi-language code execution integration
- [ ] Global leaderboard and ranking system
- [ ] User coding statistics and analytics
- [ ] Certificate generation for contests
- [ ] AI-powered coding assistant
- [ ] Discussion and collaboration features
- [ ] PDF report generation
- [ ] Additional programming language support

## Tips

- Ensure PostgreSQL is running before starting the backend.
- Make sure Docker is running before testing code execution.
- Start the backend and judge service before submitting solutions.
- Configure the frontend API URL correctly.
- Use `npm run dev` for frontend development.
- Use Maven to build and run the Spring Boot services.
- Check application logs when debugging API or execution issues.

## Known Considerations

- Docker must be available for isolated code execution.
- Judge execution depends on the availability of the judge service.
- Production deployment requires proper security and resource-limit configuration.

##  Contributors

### Bipin Rajak

- **GitHub:** https://github.com/bipin-2005
- **LinkedIn:** https://www.linkedin.com/in/bipin-rajak/

---
