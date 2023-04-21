import express from "express";
import { Product } from "../models/product";
import { getClient } from "../db";
import { ObjectId } from "mongodb";

export const productRouter = express.Router();

productRouter.get("/products", async (req, res) => {
    const client = await getClient();
    const results = await client.db().collection<Product>('products').find().toArray();
    res.json(results);
})