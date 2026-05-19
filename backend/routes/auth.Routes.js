import express from "express";
import db from "../db/db.js";
const myRouter = express.Router();
import { register, login } from "../controllers/authController.js";

myRouter.post('/register', register);
myRouter.post('/login', login);
export default myRouter;