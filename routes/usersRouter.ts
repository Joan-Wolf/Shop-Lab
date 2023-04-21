import express from "express";
import { User } from "../models/user";
import { getClient } from "../db";
import { ObjectId } from "mongodb";

export const userRouter = express.Router();

userRouter.get("/users", async (req, res) => {
    const client = await getClient();
    const results = await client.db().collection<User>('users').find().toArray();
    res.json(results);
});

userRouter.post("/users", async (req, res) => {
    const user = req.body as User;
    const client = await getClient();
    await client.db().collection<User>('users').insertOne(user);
    res.status(201).json(user);
});

userRouter.delete("/users/:id", async (req, res) => {
    const _id = new ObjectId(req.params.id);
    const client = await getClient();
    const result = await client.db().collection<User>('users')
        .deleteOne({ _id: _id });
    if (result.deletedCount === 0) {
        res.status(404).json({ message: "Not Found" });
    } else {
        res.status(204).end();
    }
});

userRouter.put("/users/:id", async (req, res) => {

    const _id = new ObjectId(req.params.id);
    const data = req.body as User;
    delete data._id;
    const client = await getClient();
    const result = await client.db().collection<User>('users').replaceOne({ _id: _id }, data);
    if (result.modifiedCount === 0) {
        res.status(404).json({ message: "Not Found" });
    } else {
        data._id = _id
        res.json(data);
    }
})