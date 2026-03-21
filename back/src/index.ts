import express, { json } from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user";
import cakeRouter from "./routes/cake";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(userRouter);
app.use(cakeRouter);

app.get("/", (req, res) => {
  return res.json({ message: "Servidor esta online!" });
});

app.listen(PORT, () => {
  console.log(`O servidor esta rodando em: http://localhost:${PORT}`);
});
