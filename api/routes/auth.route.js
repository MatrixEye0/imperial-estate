import express from 'express';
import { signup, signin } from '../controllers/auth.controller.js'; // Ensure the path is correct

const router = express.Router();

// Define your routes
router.post('/signup', signup);
router.post('/signin', signin); // Make sure 'signin' is defined and imported

export default router;
