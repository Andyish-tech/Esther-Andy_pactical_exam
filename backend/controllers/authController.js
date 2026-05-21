import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';
import dotenv from 'dotenv';
dotenv.config();

export const register = async(req, res) => {
    try{
        const { username, email, password } = req.body;
        const userRole = 'customer'; // Always force 'customer' role — admin assignment is manual
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Check if user already exists
        const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
        const checkUserResult = await new Promise((resolve, reject) => {
            db.query(checkUserQuery, [email], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });

        if (checkUserResult.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Insert new user into database
        const insertUserQuery = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        db.query(insertUserQuery, [username, email, hashedPassword, userRole], (err, results) => {
            if (err) {
                console.error('Register DB error:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'User already exists' });
                }
                return res.status(500).json({ message: 'An internal server error occurred.' });
            }
            res.status(201).json({ message: 'User created successfully' });
        });
    }                       
    catch (error) {
        console.error('Register server error:', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Login DB error:', err);
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        const user = results[0];
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        // Generate JWT token
        if (!process.env.JWT_SECRET) {
            console.error('CRITICAL: JWT_SECRET is not defined');
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
        const token = jwt.sign({ id: user.userId, role: user.role || 'customer' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
};