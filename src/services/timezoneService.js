const dotenv = require('dotenv');
dotenv.config();

const TZAPIKEY = process.env.TZ_API_KEY;
const IPAPIKEY = process.env.IP_API_KEY;

async function timeZoneLocal() {
  const url = `https://ipinfo.io/json?token=${IPAPIKEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Código: ${response.status}`);
    const data = await response.json();
    return data.timezone;
  } catch (error) {
    console.error(`ERRO: ${error.message}`);
    return null;
  }
}

async function timeZoneSolicitado(countryCode) {
  const url = `http://api.timezonedb.com/v2.1/list-time-zone?key=${TZAPIKEY}&format=json&country=${countryCode}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Código: ${response.status}`);
    const data = await response.json();
    if (data?.zones && data.zones?.length > 0) {
      return data.zones[0].zoneName;
    } else {
      throw new Error('Nenhum timezone encontrado');
    }
  } catch (error) {
    console.error(`ERRO: ${error.message}`);
    return null;
  }
}

module.exports = { timeZoneLocal, timeZoneSolicitado };
