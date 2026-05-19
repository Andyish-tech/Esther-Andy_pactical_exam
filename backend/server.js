import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import authRoutes from './routes/auth.Routes.js';
import carRoutes from './routes/car.Routes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
import db from './db/db.js';

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/api', (req, res) => {
  res.json({ message: 'API endpoint' });
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
