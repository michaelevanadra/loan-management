# Loan Application API

## Installation

To install the Loan Application API on your local machine, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/michaelevanadra/loan-management.git

   cd backend
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```sh
   NODE_ENV=development
   PG_HOST=localhost
   PG_PORT=5432
   PG_DATABASE=localdb
   PG_USER=localuser
   PG_PASSWORD=yourpassword
   ```

## Running on Local

To run the Loan Application API on your local machine, follow these steps:

1. Start the PostgreSQL database server.

2. Start the development server:
   ```sh
   npm run dev
   ```

The API will be available at `http://localhost:3001/api`.

## API Documentation

API documentation is available at `http://localhost:3001/api-docs` when running on `dev` mode.

## Build

To build the Loan Application API for production, run the following command:

```sh
npm run build
```

## Test

To run the tests, run the following command:

```sh
npm run test
```

## DB Migration

When updating database schema, run this command to generate migration scripts for production.

```sh
npm run db:generate
```
