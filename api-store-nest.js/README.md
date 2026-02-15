<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord" /></a>
  <a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us" /></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

## Description

**API Store** is a RESTful e-commerce backend API built with [NestJS](https://github.com/nestjs/nest) and TypeScript. It provides user management, product catalog, orders, support tickets, addresses, and SMS notifications with queue-based processing.

### Features

- **Authentication** — JWT-based authentication with Passport
- **Users** — User registration and profile management
- **Products & Categories** — Product catalog with categorization
- **Orders** — Order creation with event-driven factor handling
- **Addresses** — User address management
- **Support Tickets** — Ticket system for customer support
- **SMS** — Bull queue for async SMS sending with retry logic
- **Scheduled Tasks** — Cron jobs via `@nestjs/schedule`
- **API Documentation** — Swagger/OpenAPI at `/api`
- **Database** — MySQL with TypeORM
- **Event Emitter** — In-process events for order/factor flow

### Tech Stack

- NestJS 11
- TypeORM + MySQL
- Bull + Redis (job queues)
- Passport JWT
- Swagger
- class-validator / class-transformer

---

## Prerequisites

- Node.js (v18 or higher)
- MySQL 8
- Redis (for Bull queues)

---

## Project Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=api-store

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRTION=1h

PORT=3000
```

### 3. Database

Ensure MySQL is running and the database `api-store` exists. TypeORM will sync entities automatically in development (`synchronize: true`).

### 4. Redis

Start Redis locally (default: `localhost:6379`) for the SMS Bull queue.

---

## Running the Application

```bash
# Development (watch mode)
npm run start:dev

# Standard start
npm run start

# Production
npm run start:prod
```

The API runs on `http://localhost:3000` by default.

---

## API Documentation

Swagger UI is available at:

**http://localhost:3000/api**

Use the **Authorize** button to add your JWT Bearer token for protected endpoints.

---

## Running Tests

```bash
# Unit tests
npm run test

# Unit tests (watch mode)
npm run test:watch

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## Project Structure

```
src/
├── auth/          # JWT authentication
├── user/          # User management
├── product/       # Product catalog
├── category/      # Categories
├── order/         # Orders & factor events
├── address/       # Addresses
├── ticket/        # Support tickets
├── sms/           # SMS queue & processor
├── tasks/         # Scheduled cron jobs
├── seeder/        # Database seeders
└── main.ts        # Bootstrap
```

---

## Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Configure production database credentials
3. Disable TypeORM `synchronize` (use migrations instead)
4. Ensure Redis is available for Bull queues
5. Use a process manager (e.g. PM2)

See [NestJS deployment docs](https://docs.nestjs.com/deployment) for details.

---

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
