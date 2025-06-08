async function getWorldBankIndicator(countryCode, indicatorCode) {
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorCode}?format=json&per_page=100`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Código: ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data) || !Array.isArray(data[1])) {
      console.error(`Formato inesperado de resposta: ${data}`);
      return null;
    }
    const availableData = data[1].filter(item => item.value !== null);
    if (!availableData || availableData.length === 0) {
      throw new Error(`Nenhum dado disponível para o indicador ${indicatorCode}`);
    }
    const { value, date } = availableData[0];
    return { valor: value, ano: date };
  } catch (error) {
    console.error(`ERRO indicador ${indicatorCode}: ${error.message}`);
    return null;
  }
}

module.exports = { getWorldBankIndicator };
