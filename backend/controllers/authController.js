import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';
import dotenv from 'dotenv';
dotenv.config();

export const register = async(req, res) => {
    try{
        const { username, email, password } = req.body;
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
        const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(insertUserQuery, [username, email, hashedPassword], (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.status(201).json({ message: 'User created successfully' });
        });
    }                       
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        const user = results[0];
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET ||'crpms_secret_key', { expiresIn: '1h' });
        res.json({ token });
    });};