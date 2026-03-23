import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user";
import cakeRouter from "./routes/cake";
import orderRouter from "./routes/order";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(cakeRouter);
app.use(orderRouter);

app.get("/", (_req, res) => {
  return res.json({ message: "Servidor esta online!" });
});

export default app;
