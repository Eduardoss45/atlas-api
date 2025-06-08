const {
  traduzirNomePaisParaIngles,
  estruturarDadosDoPais,
  verificarDadosPais,
  formatarDataComFusoHorario,
} = require('../utils/utils');
const { getCountryInfo } = require('./countryService');
const { timeZoneLocal, timeZoneSolicitado } = require('./timezoneService');
const { getCapitalWeather } = require('./weatherService');
const { getWorldBankIndicator } = require('./worldbankService');
const { getImage } = require('./imageService');
const { getResumo } = require('./resumoService');

getImage('Brasil')

async function dataFetch(nomePaisPt) {
  const nomePaisEn = traduzirNomePaisParaIngles(nomePaisPt);
  if (!nomePaisEn) {
    throw new Error(`Não foi possível traduzir o nome do país: ${nomePaisPt}`);
  }
  const countryInfo = await getCountryInfo(nomePaisEn);
  if (!verificarDadosPais(countryInfo)) {
    throw new Error('Dados do país incompletos ou inválidos');
  }
  const [localTimeZone, solicitadoTimeZone] = await Promise.all([
    timeZoneLocal(),
    timeZoneSolicitado(countryInfo.cc),
  ]);
  if (!localTimeZone || !solicitadoTimeZone) {
    throw new Error('Não foi possível obter os fusos horários');
  }
  const climaCapital = await getCapitalWeather(countryInfo.lat, countryInfo.lng);
  const horarioLocalTimestamp = formatarDataComFusoHorario(localTimeZone);
  const horarioPaisTimestamp = formatarDataComFusoHorario(solicitadoTimeZone);
  const indicadores = await (async () => {
    const [pib, populacao, expectativaVida] = await Promise.all([
      getWorldBankIndicator(countryInfo.cc, 'NY.GDP.PCAP.CD'),
      getWorldBankIndicator(countryInfo.cc, 'SP.POP.TOTL'),
      getWorldBankIndicator(countryInfo.cc, 'SP.DYN.LE00.IN'),
    ]);
    return { pib, populacao, expectativaVida };
  })();
  const imagens = await getImage(nomePaisPt);
  const resumo = await getResumo(nomePaisPt);
  const dados = estruturarDadosDoPais({
    countryInfo,
    climaCapital,
    horarioLocalTimestamp,
    horarioPaisTimestamp,
    timezoneLocal: localTimeZone,
    timezonePais: solicitadoTimeZone,
    indicadores,
    imagens,
    resumo,
  });
  return dados;
}

module.exports = { dataFetch };
