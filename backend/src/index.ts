import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { router } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import PostgresClient from './db/postgresClient';
import { swaggerSpec } from './config/swagger';

const app: Express = express();
const port = process.env.PORT || 3001;
const db = PostgresClient.getInstance();

app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

if (process.env.NODE_ENV === 'dev') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.get('/health-check', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'API is running.' });
  return;
});

const startServer = async (): Promise<void> => {
  try {
    await migrate(db, {
      migrationsFolder: './src/db/migrations',
    });

    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
      console.log(
        `📚 Swagger documentation available at http://localhost:${port}/api-docs`,
      );
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
