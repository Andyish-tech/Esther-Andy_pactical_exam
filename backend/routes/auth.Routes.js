import express from "express";
import db from "../db/db.js";
import { body, validationResult } from 'express-validator';
const myRouter = express.Router();
import { register, login } from "../controllers/authController.js";

// Validation middleware
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

myRouter.post('/register', [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('username').notEmpty().withMessage('Username is required'),
    validateRequest
], register);

myRouter.post('/login', [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest
], login);

export default myRouter;