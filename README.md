# Atlas Platform

An Enterprise Multi-Tenant Headless CMS Platform with asynchronous background processing, Redis caching, RabbitMQ workers, and CI/CD.

## 🚀 Technologies

- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** PostgreSQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **Caching:** Redis
- **Message Broker:** RabbitMQ
- **Infrastructure:** Docker
- **Documentation:** Swagger/OpenAPI

## ✨ Features

- **Authentication & Authorization:** JWT, Refresh Tokens, RBAC (Role-Based Access Control)
- **Multi-Tenant Architecture:** Tenant context, middleware, and management
- **Headless CMS:** Content management, Categories, Media uploads, Draft/Published workflows
- **Background Processing:** RabbitMQ workers for asynchronous tasks (e.g., ZIP exports)
- **Performance:** Redis caching and optimized queries

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/luqelha/atlas-platform.git
   cd atlas-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Create a `.env` file based on your configuration requirements.

4. Start infrastructure (Database, Redis, RabbitMQ):
   ```bash
   docker-compose up -d
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:
   ```bash
   npm run start:dev
   ```

## 📚 Documentation

API documentation is automatically generated via Swagger and is accessible via the `/api/docs` (default route) when the server is running.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
