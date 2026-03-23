import app from "./app";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`O servidor esta rodando em: http://localhost:${PORT}`);
});
