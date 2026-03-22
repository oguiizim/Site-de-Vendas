import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user";
import cakeRouter from "./routes/cake";
import orderRouter from "./routes/order";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(cakeRouter);
app.use(orderRouter);

app.get("/", (req, res) => {
  return res.json({ message: "Servidor esta online!" });
});

app.listen(PORT, () => {
  console.log(`O servidor esta rodando em: http://localhost:${PORT}`);
});
