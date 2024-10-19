import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import useRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import portfinder from 'portfinder';
import cors from 'cors';  

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Use the routes before starting the server
app.use('/api/user', useRouter);
app.use('/api/auth', authRouter);

// Error handling middleware
app.use((err, req, res, next) => {
   const statusCode = err.statusCode || 500;
   const message = err.message || 'Internal Server error';
   return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
   });
});



portfinder.getPort((err, port) => {
  if (err) throw err;

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});

