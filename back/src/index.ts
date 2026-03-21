import express, { json } from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(userRouter);

app.get("/", (req, res) => {
  return res.json({ message: "Servidor esta online!" });
});

app.listen(PORT, () => {
  console.log(`O servidor esta rodando em: http://localhost:${PORT}`);
});
