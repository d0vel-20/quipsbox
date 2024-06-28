import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import dotenv from 'dotenv';
import connectDB from './db/database';
import { dot } from 'node:test/reporters';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  

