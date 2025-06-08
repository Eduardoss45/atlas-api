# Projeto: API de busca de dados sobre países

**Consulta de clima, horário, resumo, imagens e indicadores econômicos com base no nome de um país**

Esta aplicação tem como objetivo exibir o horário local de um país específico, juntamente com o clima da capital, um resumo descritivo, imagens e alguns indicadores econômicos. Para isso, utiliza múltiplas APIs:

- [TimeZoneDB](https://timezonedb.com/) – Fuso horário do país solicitado
- [IpInfo](https://ipinfo.io/) – Determinação do fuso horário local
- [Open-Meteo](https://open-meteo.com/) – Previsão do clima
- [REST Countries](https://restcountries.com/) – Dados sobre países e suas capitais
- [World Bank Open Data](https://data.worldbank.org/) – Indicadores econômicos e demográficos
- [Pexels](https://pexels.com/) – Imagens dos países
- [Wikipédia](https://pt.wikipedia.org/) – Resumo descritivo dos países

---

## Funcionalidades

### 1. **Exibição do Horário Local e do País**

Obtém o fuso horário local (com base no IP do usuário) e o fuso horário do país solicitado (via TimeZoneDB), exibindo ambos de forma formatada.

### 2. **Previsão do Clima da Capital**

A partir das coordenadas da capital, exibe a previsão do tempo para os próximos dias, incluindo temperaturas máximas e mínimas.

### 3. **Indicadores Econômicos e Demográficos**

Exibe dados fornecidos pelo Banco Mundial, como PIB, população e expectativa de vida.

### 4. **Resumo do País**

Exibe um resumo descritivo extraído da Wikipédia.

### 5. **Imagens do País**

Fornece URLs de imagens em diferentes tamanhos obtidas por meio da API da Pexels.

---

## Tecnologias Utilizadas

- **Node.js**
- **Express**
- **node-fetch**
- **dotenv**
- **APIs REST externas**: TimeZoneDB, IpInfo, REST Countries, Open-Meteo, World Bank, Wikipédia, Pexels

---

## Como Funciona

1. **Fusos Horários**

   - **Local**: Determinado pela API do IpInfo com base no IP do usuário.
   - **Do país solicitado**: Obtido pela API do TimeZoneDB com base no código do país.

2. **Informações do País**

   - A API REST Countries fornece o código do país, a capital e as coordenadas geográficas.

3. **Clima**

   - A API Open-Meteo retorna a previsão para os próximos dias, com temperaturas máximas e mínimas.

4. **Indicadores Econômicos**

   - Os dados são obtidos por meio da API do World Bank Open Data.

5. **Resumo**

   - O conteúdo é extraído da Wikipédia em português.

6. **Imagens**
   - As imagens são obtidas pela API do Pexels.

---

## Requisitos

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```env
TZ_API_KEY=your_timezonedb_api_key
IP_API_KEY=your_ipinfo_api_key
PEXELS_API_KEY=your_pexels_api_key
```

---

## Como Executar

1. Clone este repositório:

   ```bash
   git clone https://github.com/Eduardoss45/atlas-api.git
   ```

2. Acesse o diretório do projeto:

   ```bash
   cd atlas-api
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Crie o arquivo `.env` conforme instruído acima.

5. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

---

## Endpoint

### `GET /info/:paisPt`

Retorna as informações completas de um país a partir do **nome em português**.

#### Parâmetro

- `:paisPt` – Nome do país em português. Exemplos: `Brasil`, `Alemanha`, `Japão`

#### Exemplo de requisição

```http
GET /info/Brasil
```

#### Exemplo de resposta

```json
{
  "horarioLocal": "06/07/2025, 20:11:00",
  "horarioPais": "06/07/2025, 20:11:00",
  "timestamp": {
    "local": "07/06/2025, 20:11",
    "pais": "07/06/2025, 20:11"
  },
  "timezone": {
    "local": "America/Sao_Paulo",
    "pais": "America/Araguaina"
  },
  "capital": "Brasília",
  "clima": [
    {
      "dia": "2025-06-07",
      "min": 17.5,
      "max": 26.6
    }
    // ... próximos dias
  ],
  "indicadores": {
    "pib": {
      "valor": 10294.866680778,
      "ano": "2023"
    },
    "populacao": {
      "valor": 211140729,
      "ano": "2023"
    },
    "expectativaVida": {
      "valor": 75.848,
      "ano": "2023"
    }
  },
  "resumo": "...",
  "imagens": {
    "original": "https://images.pexels.com/photos/3648269/pexels-photo-3648269.jpeg"
    // ... demais tamanhos
  }
}
```

---

## Estrutura do Projeto

```bash
.
├── src/
│   ├── controllers/
│   │   └── infoController.js
│   ├── services/
│   │   ├── countryService.js
│   │   ├── dataFetch.js
│   │   ├── imageService.js
│   │   ├── resumoService.js
│   │   ├── timezoneService.js
│   │   ├── weatherService.js
│   │   └── worldbankService.js
│   ├── utils/
│   │   └── formatter.js
│   ├── data/
│   │   └── translate.json
│   └── app.js
├── .env
├── package.json
└── README.md
```

---

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma _issue_ para reportar bugs, sugerir melhorias ou enviar um _pull request_ com novas funcionalidades.

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).