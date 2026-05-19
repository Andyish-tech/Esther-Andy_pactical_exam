import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import authRoutes from './routes/auth.Routes.js';
import carRoutes from './routes/car.Routes.js';
import serviceRoutes from './routes/service.Routes.js';
import serviceRecordRoutes from './routes/serviceRecord.Routes.js';
import paymentRoutes from './routes/payment.Routes.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
import db from './db/db.js';

// Apply security headers
app.use(helmet());

// Configure CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Global Rate Limiting for API routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again later.' }
});

app.use(express.json());
app.use('/api', apiLimiter);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/service-records', serviceRecordRoutes);
app.use('/api/payments', paymentRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


