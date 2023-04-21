import express from "express";
import { Product } from "../models/product";
import { getClient } from "../db";
import { ObjectId } from "mongodb";

export const productRouter = express.Router();

productRouter.get("/products", async (req, res) => {
    const client = await getClient();
    const results = await client.db().collection<Product>('products').find().toArray();
    res.json(results);
});

productRouter.post("/products", async (req, res) => {
    const product = req.body as Product;
    const client = await getClient();
    await client.db().collection<Product>('products').insertOne(product);
    res.status(201).json(product);
});

productRouter.delete("/products/:id", async (req, res) => {
    const _id = new ObjectId(req.params.id);
    const client = await getClient();
    const result = await client.db().collection<Product>('products')
        .deleteOne({ _id: _id });
    if (result.deletedCount === 0) {
        res.status(404).json({ message: "Not Found" });
    } else {
        res.status(204).end();
    }
});

productRouter.put("/products/:id", async (req, res) => {

    const _id = new ObjectId(req.params.id);
    const data = req.body as Product;
    delete data._id;
    const client = await getClient();
    const result = await client.db().collection<Product>('products').replaceOne({ _id: _id }, data);
    if (result.modifiedCount === 0) {
        res.status(404).json({ message: "Not Found" });
    } else {
        data._id = _id
        res.json(data);
    }
})