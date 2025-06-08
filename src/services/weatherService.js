async function getCapitalWeather(lat, lng) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Código: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`ERRO: ${error.message}`);
    return null;
  }
}

module.exports = { getCapitalWeather };
