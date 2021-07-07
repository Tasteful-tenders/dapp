import mongoose from 'mongoose';
import express from "express";
import {User} from "../models";
import {ethers} from "ethers";

const userRouter = express.Router();

userRouter.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * Get all users
 */
userRouter.get('/', async (req, res: express.Response) => {
    res.json({});
})

/**
 * Get a specific users
 */
userRouter.get('/get/:address', async (req, res: express.Response) => {
    const address: string = req.params.address;
    const result = await User.findOne({address: address}).exec();
    if (result === null) {
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            address: address,
            ...{}
        });

        try {
            const newUser = await user.save();
            res.status(201).json(newUser);
            return;
        } catch (err) {
            res.status(400).end();
            return;
        }
    }
    res.status(200).json(result).end();
});

userRouter.post('/update/:address', async (req, res: express.Response) => {
    const address: string = req.params.address;
    const user = await User.findOne({address: address}).exec();
    if (user === null || req.body.userData === undefined || req.body.signature === undefined) {
        res.status(404).end();
        return;
    }

    const msgHash = ethers.utils.hashMessage(JSON.stringify(req.body.userData));
    const msgHashBytes = ethers.utils.arrayify(msgHash);
    const recoveredAddress = ethers.utils.recoverAddress(msgHashBytes, req.body.signature);

    if (recoveredAddress !== address) {
        res.status(403).end();
        return;
    }

    try {
        user.set(req.body.userData);
        const result = await user.save();

        res.status(200).json(user).end();
    } catch (err) {
        res.status(400).end();
    }
});

export {userRouter}