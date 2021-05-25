const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const routes = require("./routes");
app.use(routes);

app.get("/", (req, res) => {
  res.send("Programação para Internet II - Trabalho 2 (Rafael Ochôa Mello)");
});

app.listen(port, () => {
  console.log(`App rodando em: http://localhost:${port}`);
});