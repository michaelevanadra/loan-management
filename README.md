# Loan Management System

This is a simple loan management system that allows you to create, read, update, and delete loan applications.

## Run the project

Run the whole project stack using docker compose.

```bash
docker-compose up
```

## Run the project manually

If you choose to run the project manually, for testing and development purposes, you need to run the following commands:

### Frontend

Detailed steps can be found in the [frontend README](./frontend/README.md)

```bash
cd frontend
npm
npm run dev
```

### Backend

Detailed steps can be found in the [backend README](./backend/README.md)

```bash
cd backend
npm install
npm run dev
```

### Database

You need to have a postgres database running. You may use a dockerized database or a local one.

> These modules are intended to be individual repositories but for presentation and convenience, they are kept in the same repository.
