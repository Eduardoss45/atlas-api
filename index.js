const dotenv = require('dotenv')
dotenv.config()
const paises = require('./json/translate.json')
const TZAPIKEY = process.env.TZ_API_KEY // * TimeZoneDB
const IPAPIKEY = process.env.IP_API_KEY // * IpInfo

// * Função para formatar a data com o fuso horário
function formatarDataComFusoHorario(timeZone) {
    const dataAtual = new Date()

    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: timeZone,
        timeStyle: 'short',
        dateStyle: 'short'
    }).format(dataAtual)
}

// * Verifica os dados recebidos
function verificarDadosPais(countryInfo) {
    if (!countryInfo) {
        console.log('Não foi possível obter informações do país.')
        return false
    } else if (!countryInfo.cc) {
        console.log('Não foi possível obter o código do país.')
        return false
    } else if (!countryInfo.cap) {
        console.log('Não foi possível obter a capital do país.')
        return false
    } else if (!countryInfo.lat || !countryInfo.lng) {
        console.log('Não foi possível obter as coordenadas geográficas.')
        return false
    }
    return true
}

// * Função para obter o fuso horário local
async function timeZoneLocal() {
    const url = `https://ipinfo.io/json?token=${IPAPIKEY}`
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Código: ${response.status}`)
        const data = await response.json()
        return data.timezone
    } catch (error) {
        console.error(`ERRO: ${error.message}`)
        return null
    }
}

// * Função para obter o fuso horário do país solicitado via TimeZoneDB
async function timeZoneSolicitado(countryCode) {
    const url = `http://api.timezonedb.com/v2.1/list-time-zone?key=${TZAPIKEY}&format=json&country=${countryCode}`
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Código: ${response.status}`)
        const data = await response.json()
        if (data.zones && data.zones.length > 0) {
            return data.zones[0].zoneName
        } else {
            throw new Error('Nenhum timezone encontrado')
        }
    } catch (error) {
        console.error(`ERRO: ${error.message}`)
        return null
    }
}

// * Função para obter o informações do país
async function getCountryInfo(nomePais) {
    const url = `https://restcountries.com/v3.1/name/${nomePais}?fullText=true`
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Código: ${response.status}`)
        const data = await response.json()
        const [lat, lng] = data[0]?.capitalInfo?.latlng || [null, null]
        return { cc: data[0].cca2, cap: data[0].capital, lat: lat, lng: lng }
    } catch (error) {
        console.error(`ERRO: ${error.message}`)
        return null
    }
}

// * Função para obter o clima da capital do país com Open-Meteo:
async function getCapitalWeather(lat, lng) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Código: ${response.status}`)
        const data = await response.json()
        return data
    } catch (error) {
        console.error(`ERRO: ${error.message}`)
        return null
    }
}

// * Função para obter dados economicos e populacionais do país
async function getWorldBankIndicator(countryCode, indicatorCode) {
    const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorCode}?format=json&per_page=100`
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Código: ${response.status}`)
        const data = await response.json()
        const availableData = data[1]?.filter(item => item.value !== null)
        if (availableData.length === 0) {
            console.log('Nenhum dado disponível para os anos solicitados.')
            return null
        }
        const { value, date } = availableData[0]
        return { valor: value, ano: date }
    } catch (error) {
        console.error(`ERRO indicador ${indicatorCode}: ${error.message}`)
        return null
    }
}

// * Função para traduzir o nome do país de PT para EN usando a API do IBGE
function traduzirNomePaisParaIngles(nomePt) {
    return paises[nomePt] || null
}

// * Função principal para exibir informações
async function showInfo(nomePaisPt) {
    const nomePaisEn = traduzirNomePaisParaIngles(nomePaisPt)
    if (!nomePaisEn) {
        console.log('Não foi possível traduzir o nome do país.')
        return
    }

    const countryInfo = await getCountryInfo(nomePaisEn)

    if (!verificarDadosPais(countryInfo)) return

    const [localTimeZone, solicitadoTimeZone] = await Promise.all([
        timeZoneLocal(),
        timeZoneSolicitado(countryInfo.cc)
    ])
    const climaCapital = await getCapitalWeather(countryInfo.lat, countryInfo.lng)

    if (!localTimeZone || !solicitadoTimeZone) {
        console.log('Não foi possível obter os fusos horários.')
        return
    }

    const horarioLocal = formatarDataComFusoHorario(localTimeZone)
    const horarioSolicitado = formatarDataComFusoHorario(solicitadoTimeZone)

    const [pib, populacao, expectativaVida, co2] = await Promise.all([
        getWorldBankIndicator(countryInfo.cc, 'NY.GDP.PCAP.CD'),
        getWorldBankIndicator(countryInfo.cc, 'SP.POP.TOTL'),
        getWorldBankIndicator(countryInfo.cc, 'SP.DYN.LE00.IN'),
        getWorldBankIndicator(countryInfo.cc, 'EN.ATM.CO2E.PC'),
    ])

    console.log('Horário Local:', horarioLocal)
    console.log(`Horário em ${nomePaisPt}:`, horarioSolicitado)
    if (climaCapital?.daily) {
        const dias = climaCapital.daily.time
        const max = climaCapital.daily.temperature_2m_max
        const min = climaCapital.daily.temperature_2m_min

        console.log('\n📅 Clima da semana em', countryInfo.cap[0])
        dias.forEach((dia, i) => {
            console.log(`${dia}: Máx ${max[i]}°C / Mín ${min[i]}°C`)
        })
    }
    console.log('\n📊 Indicadores Socioeconômicos (últimos dados disponíveis):')
    if (pib) console.log(`PIB per capita: US$ ${pib.valor?.toLocaleString()} (${pib.ano})`)
    if (populacao) console.log(`População total: ${populacao.valor?.toLocaleString()} (${populacao.ano})`)
    if (expectativaVida) console.log(`Expectativa de vida: ${expectativaVida.valor?.toFixed(1)} anos (${expectativaVida.ano})`)
    if (co2) console.log(`Emissões de CO₂ per capita: ${co2.valor?.toFixed(2)} t (${co2.ano})`)


    setInterval(() => {
        const novoHorarioLocal = formatarDataComFusoHorario(localTimeZone)
        const novoHorarioSolicitado = formatarDataComFusoHorario(solicitadoTimeZone)

        console.clear()
        console.log('Horário Local:', novoHorarioLocal)
        console.log(`Horário em ${nomePaisPt}:`, novoHorarioSolicitado)
        if (climaCapital?.daily) {
            const dias = climaCapital.daily.time
            const max = climaCapital.daily.temperature_2m_max
            const min = climaCapital.daily.temperature_2m_min

            console.log('\n📅 Clima da semana em', countryInfo.cap[0])
            dias.forEach((dia, i) => {
                console.log(`${dia}: Máx ${max[i]}°C / Mín ${min[i]}°C`)
            })
        }
        console.log('\n📊 Indicadores Socioeconômicos (últimos dados disponíveis):')
        if (pib && pib.valor != null) {
            console.log(`PIB per capita: US$ ${pib.valor?.toLocaleString()} (${pib.ano})`)
        } else {
            console.log("PIB per capita: Dados não disponíveis.")
        }

        if (populacao && populacao.valor != null) {
            console.log(`População total: ${populacao.valor.toLocaleString()} (${populacao.ano})`)
        } else {
            console.log("População: Dados não disponíveis.")
        }

        if (expectativaVida && expectativaVida.valor != null) {
            console.log(`Expectativa de vida: ${expectativaVida.valor.toFixed(1)} anos (${expectativaVida.ano})`)
        } else {
            console.log("Expectativa de vida: Dados não disponíveis.")
        }

        if (co2 && co2.valor != null) {
            console.log(`Emissões de CO₂ per capita: ${co2.valor.toFixed(2)} t (${co2.ano})`)
        } else {
            console.log("Emissões de CO₂: Dados não disponíveis.")
        }

    }, 60000)
}

showInfo('Japão')