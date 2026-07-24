<div align="center">
  
# 🌍 Atlas Platform

**An Enterprise Multi-Tenant Headless CMS Platform**

_Equipped with asynchronous background processing, Redis caching, RabbitMQ workers, and automated CI/CD pipelines._

### 🛠️ Tech Stack

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/Rabbitmq-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

</div>

## ✨ Key Features

- **🔐 Security & Auth:** JWT, Refresh Tokens, and robust RBAC (Role-Based Access Control).
- **🏢 True Multi-Tenancy:** Secure tenant context isolation and management middleware.
- **📝 Headless CMS:** Dynamic content management, hierarchical categories, and draft-to-publish workflows.
- **⚙️ Background Processing:** RabbitMQ-powered workers for non-blocking asynchronous tasks (like ZIP exports).
- **⚡ High Performance:** Sub-millisecond reads powered by Redis caching and highly optimized database queries.

## 📦 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) **(v18 or higher)**
- ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) & **Docker Compose**

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/luqelha/atlas-platform.git
   cd atlas-platform
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory based on your configuration requirements (e.g., database credentials, JWT secrets).

4. **Spin up Infrastructure:**
   Start the Database, Redis, and RabbitMQ via Docker:

   ```bash
   docker-compose up -d
   ```

5. **Run Migrations:**
   Apply the database schema:

   ```bash
   npx prisma migrate dev
   ```

6. **Start the Development Server:**
   ```bash
   npm run start:dev
   ```

## 📚 Documentation

Detailed API documentation is automatically generated via Swagger. Once the server is running, navigate to:

👉 **`/api/docs`** _(Default Route)_

You can also check out our planning documents:

- [📝 Product Requirements (PRD)](PRODUCT_REQUIREMENTS.md)
- [🗺️ Roadmap](ROADMAP.md)
- [📅 Development Sprint Plan](DEVELOPMENT.md)

## 📄 License

This project is licensed under the [MIT License](LICENSE).
