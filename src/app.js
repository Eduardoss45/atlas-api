const express = require('express');
const app = express();
const port = 3000;
const { getCountryData } = require('./controllers/infoController.js');

app.use(express.json());

app.get('/info/:pais', getCountryData);

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});