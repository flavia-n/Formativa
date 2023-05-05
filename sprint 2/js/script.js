
///////////////grafico mapa/////////////////////
google.charts.load('current', {
    'packages': ['geochart'],
});
google.charts.setOnLoadCallback(desenharmapa);

function desenharmapa() {

    let data = google.visualization.arrayToDataTable(dadosPais);

    let options = {
        colorAxis: { colors: ['#058E73', '#05986A'] },
        backgroundColor: '#ADD8E6'
    }

    let chart = new google.visualization.GeoChart(document.getElementById('grafico-mapa'));

    chart.draw(data, options);
}

var dadosPais = [['País', 'Total']];
var dadosPizza = [['status', 'total'], ['0', 0]];

async function carregarDadosMapa() {

    // let divErro = document.getElementById('div-erro');
    // divErro.style.display = 'none';


    fetch('https://covid19-brazil-api.now.sh/api/report/v1/countries')
        .then(response => response.json())
        .then(dados => preparaDadosMapa(dados))
        .catch(e => exibirErro(e.message));
}

function exibirErro(mensagem) {
    // let divErro = document.getElementById('div-erro');
    // divErro.innerHTML = '<b>Erro ao acessar a API</b><br />' + mensagem;
    // divErro.style.display = 'block';
}

function preparaDadosMapa(dados) {
    let confirmados = 0;
    for (let i = 0; i < dados['data'].length; i++) {
        dadosPais.push([dados['data'][i].country, dados['data'][i].confirmed]);
    }
    desenharmapa();

}

////////////grafico pizza//////////////
async function carregarDadosPizza() {

    // let divErro = document.getElementById('div-erro');
    // divErro.style.display = 'none';

    fetch('https://covid19-brazil-api.now.sh/api/report/v1/countries')
        .then(response => response.json())
        .then(dados => preparaDadosPizza(dados))
        .catch(e => exibirErro(e.message));
}


google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(desenharGraficoPizza);

function desenharGraficoPizza() {

    let data = google.visualization.arrayToDataTable(dadosPizza);

    let options = {
        title: 'Totais mundiais',
        is3D: true
    };

    let chart = new google.visualization.PieChart(document.getElementById('grafico-pizza'));
    chart.draw(data, options);
}

function preparaDadosPizza(dados) {
    console.log('Entrei no preparDadosPizz')
    let confirmados = 0;
    let mortos = 0;
    let recuperados = 0;

    for (let i = 0; i < dados['data'].length; i++) {
        confirmados = confirmados + dados['data'][i].confirmed;
        mortos = mortos + dados['data'][i].deaths;
        recuperados = recuperados + dados['data'][i].recovered;
    }

    dadosPizza = [['status', 'total']];
    dadosPizza.push(['confirmados', confirmados])
    dadosPizza.push(['mortos', mortos])
    dadosPizza.push(['recuperados', recuperados])
    console.log(dadosPizza);
    desenharGraficoPizza();

}



//////grafico tabela/////////////
/*vamos consumir os dados da API coinbase, que retorna código e nome das moedas do mundo:
         https://covid19-brazil-api.now.sh/api/report/v1   ///coloca no google e copia e colocar no site json formatte */

// ler a API coinbase e obter os dados em formato Json
async function carregarDados() {
    //ocultar a div de erro (se ela estiver visível)
    // let divErro = document.getElementById('div-erro');
    // divErro.style.display = 'none';

    //chamada a API para obter os dados
    await fetch('https://covid19-brazil-api.now.sh/api/report/v1')//chamando o endereço da API
        .then(Response => Response.json())                   //obtendo a respostace formatando com json
        .then(dados => prepararDados(dados))                 //chamando função para gerar HTML dinâmico
        .catch(e => exibirErro(e.message));                  //exibindo erro na div-erro (se houver)
}


//função para mostrar erro (quando houver)

// function exibirErro(mensagem) {
//     let divErro = document.getElementById('div-erro');
//     divErro.innerHTML = '<b>Erro ao acessar a API</b><br />' + mensagem;
//     divErro.style.display = 'block';
// }

//função para preparar os dados e gerar o HTML dinâmico
function prepararDados(dados) {

    //variável para manipular o tbody do html
    // let linhas = document.getElementById('linhas');
    // linhas.innerHTML = '';

    //laço For para percorrer todos os dados recebidos
    for (let i = 0; i < dados['data'].length; i++) {
        let auxLinha = '';

        //linha zebrada
        if (i % 2 != 0)
            auxLinha = '<tr class="listra">';
        else
            auxLinha = '<tr>';

        //Continuar inserindo o código e o nome da moeda
        auxLinha = auxLinha + '<td>' + dados['data'][i].uf + '</td>' +
            '<td>' + dados['data'][i].state + '</td>' +
            '<td>' + dados['data'][i].cases + '</td>' +
            '<td>' + dados['data'][i].deaths + '</td>' +
            '<td>' + dados['data'][i].suspects + '</td>' +
            '<td>' + dados['data'][i].refuses + '</td>' +
            '</tr>';


        linhas.innerHTML = linhas.innerHTML + auxLinha;


    }
}



/////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded",
    function (event) {
        carregarDadosPizza();
        carregarDadosMapa();
        carregarDados();
    }
);