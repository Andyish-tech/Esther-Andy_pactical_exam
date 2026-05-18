import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const register = (req, res) => {
  const { username, email, password } = req.body;
  const q = 'SELECT * FROM users WHERE email = ?';