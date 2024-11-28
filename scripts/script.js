const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');

sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', () => {
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        });
        li.classList.add('active');
    });
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
        e.preventDefault();
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
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light'); // Salva o tema
});

// Mantém o tema ao recarregar a página ou define o padrão inicial
window.onload = () => {
    const savedTheme = localStorage.getItem('theme');

    // Define 'dark' como padrão se não houver tema salvo
    if (!savedTheme || savedTheme === 'dark') {
        document.body.classList.add('dark');
    }

    exibirFiltro('home'); // Exibe a página inicial ao carregar
};


let currentFilter = '';

function exibirFiltro(filtro) {
    document.getElementById('filtroHome').style.display = 'none';
    document.getElementById('filtroMotoristas').style.display = 'none';
    document.getElementById('filtroPlacas').style.display = 'none';
    document.getElementById('filtroExames').style.display = 'none';
    document.getElementById('searchField').value = ''; // Limpar a barra de pesquisa ao mudar de filtro

    if (filtro === 'home') {
        document.getElementById('filtroHome').style.display = 'block';
        document.querySelector('footer').style.display = 'block'; // Exibe o rodapé apenas na Home
    } else {
        document.querySelector('footer').style.display = 'none'; // Esconde o rodapé fora da Home

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
            fetchExames(); // Inicializa os dados de exames
        }
    }
}

function filtrarDados() {
    const query = document.getElementById('searchField').value.toUpperCase();
    if (currentFilter === 'motoristas') {
        fetchMotoristas(query);
    } else if (currentFilter === 'placas') {
        fetchPlacas(query);
    } else if (currentFilter === 'exames') {
        filtrarToxicologicos(query); // Adiciona o filtro de exames
    }
}

function fetchExames() {
    const listaToxicologicos = document.getElementById('listaToxicologicos');
    if (listaToxicologicos.children.length > 0) return; // Evita recarregar se já tiver conteúdo

    fetch('info/motoristas.json')
        .then(response => response.text())
        .then(data => {
            const toxicologicos = data.split(/\r?\n/);
            listaToxicologicos.innerHTML = ''; // Limpa a lista
            toxicologicos.forEach(nome => {
                nome = nome.trim();
                if (nome) {
                    const div = document.createElement('div');
                    div.classList.add('toxicologico-item'); // Adiciona classe correta
                    div.innerHTML = `<span>${nome}</span>`;
                    listaToxicologicos.appendChild(div);
                    verificarEAdicionarLinkToxicologico(nome, div);
                }
            });
        });
}

function filtrarToxicologicos(filtro) {
    const lista = document.getElementById('listaToxicologicos');
    const divs = lista.getElementsByClassName('toxicologico-item'); // Usa classe correta
    let itemEncontrado = false;

    for (let i = 0; i < divs.length; i++) {
        const toxicologico = divs[i].getElementsByTagName('span')[0];
        if (toxicologico) {
            if (toxicologico.innerHTML.toUpperCase().indexOf(filtro) > -1) {
                divs[i].style.display = "";
                itemEncontrado = true;
            } else {
                divs[i].style.display = "none";
            }
        }
    }

    const imagemResultadoToxicologico = document.getElementById('resultadoImagemToxicologico');
    if (!itemEncontrado) {
        imagemResultadoToxicologico.style.display = 'block';
    } else {
        imagemResultadoToxicologico.style.display = 'none';
    }
}

function verificarEAdicionarLinkToxicologico(nome, div) {
    const extensoes = ['pdf', 'jpg', 'jpeg', 'png'];
    const basePath = `/download/exame/${nome}.`;

    extensoes.forEach(ext => {
        fetch(basePath + ext)
            .then(response => {
                if (response.status === 200) {
                    const link = document.createElement('a');
                    link.href = basePath + ext;
                    link.classList.add('button-visualizar');
                    link.target = '_blank';
                    link.textContent = 'Baixar Exame';
                    div.appendChild(link);
                    throw new Error('Arquivo encontrado'); // Interrompe o loop ao encontrar
                }
            })
            .catch(error => {
                if (error.message !== 'Arquivo encontrado') {
                    console.log(error.message);
                }
            });
    });
}
