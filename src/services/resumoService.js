async function getResumo(nomePais) {
  try {
    const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${nomePais}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados da Wikipedia');
    }
    const data = await response.json();
    return data.extract;
  } catch (error) {
    console.error('Erro ao buscar informações da Wikipedia:', error);
    return null;
  }
}

module.exports = { getResumo };
