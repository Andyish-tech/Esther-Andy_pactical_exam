import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const register = (req, res) => {
    try{
        const { username, email, password } = req.body;
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Check if user already exists
        const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(checkUserQuery, [email], (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (results.length > 0) return res.status(400).json({ message: 'User already exists' });
        });
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