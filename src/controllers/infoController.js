const { dataFetch } = require('../services/dataFetch');

async function getCountryData(req, res) {
  const { pais } = req.params;
  try {
    const data = await dataFetch(pais);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(`Erro ao buscar dados do país: ${error.message}`);
  }
}

module.exports = {
  getCountryData,
};
