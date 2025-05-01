const apiKey = "MRR9VX9H73FM"; // * TimeZoneDB

function formatarDataComFusoHorario(timeZone) {
    const dataAtual = new Date();

    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: timeZone,
        timeStyle: 'short',
        dateStyle: 'short'
    }).format(dataAtual);
}

// * timeZone local
async function timeZoneLocal() {
    const url = 'https://ipinfo.io/json?token=79dcb1295137f8';
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Codigo: ${response.status}`);
        const data = await response.json();
        return data.timezone;
    } catch (error) {
        console.error(`ERRO: ${error.message}`);
        return null;
    }
}

// * timeZone solicitado via TimeZoneDB
async function timeZoneSolicitado() {
    const countryCode = "JP";
    const url = `http://api.timezonedb.com/v2.1/list-time-zone?key=${apiKey}&format=json&country=${countryCode}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Codigo: ${response.status}`);
        const data = await response.json();
        if (data.zones && data.zones.length > 0) {
            return data.zones[0].zoneName;
        } else {
            throw new Error("Nenhum timezone encontrado");
        }
    } catch (error) {
        console.error(`ERRO: ${error.message}`);
        return null;
    }
}

async function exibirHorarios() {
    const localTimeZone = await timeZoneLocal();
    const solicitadoTimeZone = await timeZoneSolicitado();

    if (localTimeZone && solicitadoTimeZone) {
        const horarioLocal = formatarDataComFusoHorario(localTimeZone);
        const horarioSolicitado = formatarDataComFusoHorario(solicitadoTimeZone);

        console.log('Horário Local:', horarioLocal);
        console.log('Horário Solicitado (Japão):', horarioSolicitado);
    } else {
        console.log("Não foi possível obter os fusos horários.");
    }
}

exibirHorarios();
