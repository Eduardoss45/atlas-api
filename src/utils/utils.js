const paises = require('../data/translate.json');

function formatarDataComFusoHorario(timeZone) {
  const dataAtual = new Date();
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: timeZone,
    timeStyle: 'short',
    dateStyle: 'short',
  }).format(dataAtual);
}

function verificarDadosPais(countryInfo) {
  if (!countryInfo) {
    console.log('Não foi possível obter informações do país.');
    return false;
  } else if (!countryInfo.cc) {
    console.log('Não foi possível obter o código do país.');
    return false;
  } else if (!countryInfo.cap) {
    console.log('Não foi possível obter a capital do país.');
    return false;
  } else if (!countryInfo.lat || !countryInfo.lng) {
    console.log('Não foi possível obter as coordenadas geográficas.');
    return false;
  }
  return true;
}

function traduzirNomePaisParaIngles(nomePt) {
  return paises[nomePt] || null;
}

function estruturarDadosDoPais({
  countryInfo,
  climaCapital,
  horarioLocalTimestamp,
  horarioPaisTimestamp,
  timezoneLocal,
  timezonePais,
  indicadores,
  imagens,
  resumo,
}) {
  const dias = climaCapital?.daily?.time || [];
  const min = climaCapital?.daily?.temperature_2m_min || [];
  const max = climaCapital?.daily?.temperature_2m_max || [];

  return {
    horarioLocal: new Date(horarioLocalTimestamp).toLocaleString(),
    horarioPais: new Date(horarioPaisTimestamp).toLocaleString(),
    timestamp: {
      local: horarioLocalTimestamp,
      pais: horarioPaisTimestamp,
    },
    timezone: {
      local: timezoneLocal,
      pais: timezonePais,
    },
    capital: countryInfo.cap[0],
    clima: dias.map((dia, i) => ({
      dia,
      min: min[i],
      max: max[i],
    })),
    indicadores: {
      pib: indicadores.pib,
      populacao: indicadores.populacao,
      expectativaVida: indicadores.expectativaVida,
    },
    resumo: resumo,
    imagens: imagens,
  };
}

module.exports = {
  formatarDataComFusoHorario,
  verificarDadosPais,
  traduzirNomePaisParaIngles,
  estruturarDadosDoPais,
};
