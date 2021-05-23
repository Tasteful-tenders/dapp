import mongoose from 'mongoose';
import express from "express";

const userRouter = express.Router()

/**
 * Get all users
 */
 userRouter.get('/', async (_, res: express.Response) => {
    res.json({});
})

export { userRouter }