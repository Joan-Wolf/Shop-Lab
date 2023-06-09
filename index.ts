import express from "express";
import { productRouter } from "./routes/productsRouter";

const app = express();

app.use(express.json());
app.use("/", productRouter)

app.listen(3000, () => console.log('Server Running!'));