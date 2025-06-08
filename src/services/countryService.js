async function getCountryInfo(nomePais) {
  const url = `https://restcountries.com/v3.1/name/${nomePais}?fullText=true`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Código: ${response.status}`);
    const data = await response.json();
    const [lat, lng] = data[0]?.capitalInfo?.latlng || [null, null];
    return { cc: data[0].cca2, cap: data[0].capital, lat: lat, lng: lng };
  } catch (error) {
    console.error(`ERRO: ${error.message}`);
    return null;
  }
}

module.exports = { getCountryInfo };
