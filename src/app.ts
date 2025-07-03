import express from 'express';
import mainRouter from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(express.json());
app.use('/api', mainRouter);

app.use(errorHandler);

export default app;