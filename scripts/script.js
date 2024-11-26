const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');

sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', () => {
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});

const menuBar = document.querySelector('.content nav .bx.bx-menu');
const sideBar = document.querySelector('.sidebar');

menuBar.addEventListener('click', () => {
    sideBar.classList.toggle('close');
});

const searchBtn = document.querySelector('.content nav form .form-input button');
const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
const searchForm = document.querySelector('.content nav form');

searchBtn.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault;
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchBtnIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchBtnIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        sideBar.classList.add('close');
    } else {
        sideBar.classList.remove('close');
    }
    if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
});

// Event listener para alternar o tema
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', function () {
    document.body.classList.toggle('dark');
});


let currentFilter = '';

function exibirFiltro(filtro) {
    document.getElementById('filtroMotoristas').style.display = 'none';
    document.getElementById('filtroPlacas').style.display = 'none';
    document.getElementById('filtroExames').style.display = 'none';
    document.getElementById('searchField').value = ''; // Limpar a barra de pesquisa ao mudar de filtro

    if (filtro === 'placas') {
        document.getElementById('filtroPlacas').style.display = 'block';
        currentFilter = 'placas';
        fetchPlacas('');
    } else if (filtro === 'motoristas') {
        document.getElementById('filtroMotoristas').style.display = 'block';
        currentFilter = 'motoristas';
        fetchMotoristas('');
    } else if (filtro === 'exames') {
        document.getElementById('filtroExames').style.display = 'block';
        currentFilter = 'exames';
        fetchExames('');
    }
}


function filtrarDados() {
    const query = document.getElementById('searchField').value.toUpperCase();
    if (currentFilter === 'motoristas') {
        fetchMotoristas(query);
    } else if (currentFilter === 'placas') {
        fetchPlacas(query);
    }
}

function filtrarPlacas() {
    const input = document.getElementById('filtroPlaca');
    const filtro = input.value.toUpperCase();
    const lista = document.getElementById('listaPlacas');
    const divs = lista.getElementsByClassName('placa-item');
    let itemEncontrado = false;

    for (let i = 0; i < divs.length; i++) {
        let placa = divs[i].getElementsByTagName('span')[0];
        if (placa) {
            if (placa.innerHTML.toUpperCase().indexOf(filtro) > -1) {
                divs[i].style.display = "";
                itemEncontrado = true;
            } else {
                divs[i].style.display = "none";
            }
        }       
    }

    const imagemResultado = document.getElementById('resultadoImagem');
    if (!itemEncontrado) {
        imagemResultado.style.display = 'block';
    } else {
        imagemResultado.style.display = 'none';
    }
}

        // Adiciona a classe 'dark' ao body para iniciar no modo dark
        document.body.classList.add('dark');

        // Controla qual seção está visível e exibe o rodapé apenas no "Home"
        function exibirFiltro(secao) {
            // Esconde todas as seções
            document.getElementById('filtroHome').style.display = 'none';
            document.getElementById('filtroPlacas').style.display = 'none';
            document.getElementById('filtroMotoristas').style.display = 'none';
            document.getElementById('filtroExames').style.display = 'none';

            // Esconde o rodapé por padrão
            document.querySelector('footer').style.display = 'none';

            // Exibe a seção selecionada e o rodapé apenas na Home
            if (secao === 'home') {
                document.getElementById('filtroHome').style.display = 'block';
                document.querySelector('footer').style.display = 'block';
            } else if (secao === 'placas') {
                document.getElementById('filtroPlacas').style.display = 'block';
            } else if (secao === 'motoristas') {
                document.getElementById('filtroMotoristas').style.display = 'block';
            } else if (secao === 'exames') {
                document.getElementById('filtroExames').style.display = 'block';
            }
        }

        // Exibe o rodapé ao carregar a página na seção "Home"
        window.onload = () => {
            exibirFiltro('home');
        };