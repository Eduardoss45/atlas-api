# Projeto: Exibição de Horários e Clima de Países no Terminal

Este projeto tem como objetivo principal exibir o horário local de um país específico, juntamente com o clima da capital desse país. O código utiliza diversas APIs para obter as informações necessárias, como a TimeZoneDB para fusos horários, IpInfo para determinar o fuso horário local, Open-Meteo para o clima e RestCountries para obter as informações do país.

## Funcionalidades

### 1. **Exibição do Horário Local e do País**

O sistema consegue obter o fuso horário local e de um país específico e exibe o horário formatado de ambos. O horário local é baseado no IP do usuário, enquanto o horário do país é baseado no código de país obtido através de uma consulta à API do TimeZoneDB.

### 2. **Previsão do Clima da Capital**

O sistema também exibe a previsão do clima da capital do país. A previsão inclui a temperatura máxima e mínima para os próximos dias.

### 3. **Intervalo de Atualização**

O horário local e o horário do país são atualizados a cada minuto, mantendo as informações sempre atuais na tela.

## Como Funciona

1. **Obtenção de Fusos Horários:**

   - **Local:** O fuso horário local é determinado utilizando a API do IpInfo, que fornece a zona de tempo baseada no endereço IP do usuário.
   - **Solicitado:** O fuso horário de um país é obtido por meio da API do TimeZoneDB, que retorna a zona de tempo com base no código do país.

2. **Obtenção de Informações do País:**
   O código consulta a API `RestCountries` para obter o código do país, a capital e as coordenadas geográficas (latitude e longitude).

3. **Clima da Capital:**
   A partir das coordenadas da capital, o clima é consultado na API Open-Meteo, que retorna a previsão do tempo para os próximos dias, com informações sobre as temperaturas máximas e mínimas.

### Bibliotecas e Ferramentas Utilizadas

- **dotenv:** Para carregar as variáveis de ambiente com as chaves das APIs.
- **fetch:** Para realizar as requisições HTTP e obter os dados das APIs.
- **Intl.DateTimeFormat:** Para formatar as datas e exibir o horário corretamente de acordo com o fuso horário.

## Requisitos

Este projeto depende de algumas variáveis de ambiente que devem ser configuradas em um arquivo `.env` na raiz do projeto. As chaves necessárias são:

- **TZ_API_KEY:** Chave da API TimeZoneDB.
- **IP_API_KEY:** Chave da API IpInfo.

Para usar as APIs, você precisará de uma chave de acesso para cada uma das APIs mencionadas. Crie uma conta nas plataformas e insira as chaves correspondentes no arquivo `.env`.

## Como Executar

1. Clone este repositório:

   ```bash
   git clone https://github.com/Eduardoss45/atlas-api.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd atlas-api-main
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Crie um arquivo `.env` na raiz do projeto e adicione suas chaves de API:

   ```text
   TZ_API_KEY=your_timezonedb_api_key
   IP_API_KEY=your_ipinfo_api_key
   ```

5. Execute o projeto:

   ```bash
   npm run dev
   ```

## Futuro Projeto

Este código serve como base para um futuro projeto que ampliará essas funcionalidades. O objetivo será criar uma aplicação web que permita aos usuários consultar horários e clima de diferentes países de maneira mais interativa. Algumas melhorias e funcionalidades adicionais incluem:

- **Interface Gráfica (Frontend):** Um frontend interativo para exibir as informações de forma mais amigável e visual, usando frameworks como React ou Vue.js.
- **Busca por Países:** Os usuários poderão pesquisar por diferentes países para ver o horário local e a previsão do clima da capital.

## Contribuindo

Se você quiser contribuir para este projeto, fique à vontade para enviar pull requests ou abrir issues para sugerir melhorias ou relatar bugs.
