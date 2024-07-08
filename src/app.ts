import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
import connectDB from './db/database';
import { dot } from 'node:test/reporters';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }))

  await connectDB();

  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
  });


  app.use('/api/auth', authRoutes);

  // 404 route
  app.use((req: any, res: any) => {
    return res.status(404).json({ data: `Cannot ${req.method} route ${req.path}`, statusCode: 404, msg: "Failure" })
})
}
  
startServer()
