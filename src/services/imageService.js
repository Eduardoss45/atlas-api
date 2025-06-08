const dotenv = require('dotenv');
dotenv.config();

const PEXELSKEY = process.env.PEXELS_API_KEY;

async function getImage(nomePais) {
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${nomePais}&per_page=1`, {
      headers: {
        Authorization: PEXELSKEY,
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados do Pexels');
    }
    const data = await response.json();
    return data.photos?.[0]?.src;
  } catch (error) {
    console.error('Erro ao buscar imagem do local:', error);
  }
}

module.exports = { getImage };
