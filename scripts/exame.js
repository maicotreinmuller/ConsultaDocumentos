document.addEventListener("DOMContentLoaded", function () {
    // Carrega dados do motoristas.json
    fetch('info/motoristas.json')
        .then(response => response.text())
        .then(data => {
            const toxicologicos = data.split(/\r?\n/);
            const listaToxicologicos = document.getElementById("listaToxicologicos");

            // Cria elementos para cada nome
            toxicologicos.forEach(nome => {
                nome = nome.trim();
                if (nome) {
                    const div = document.createElement('div');
                    div.classList.add('toxicologico-item'); // Classe correta
                    div.innerHTML = `<span>${nome}</span>`;
                    listaToxicologicos.appendChild(div);
                    verificarEAdicionarLinkToxicologico(nome, div);
                }
            });
        });

    // Atualiza a lista ao digitar no campo de pesquisa global
    const searchField = document.getElementById('searchField');
    searchField.addEventListener('input', () => {
        if (currentFilter === 'exames') {
            filtrarToxicologicos(searchField.value.toUpperCase());
        }
    });
});

// Verifica se há arquivos disponíveis para download e adiciona o link
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

// Filtra os exames toxicológicos com base no campo de pesquisa
function filtrarToxicologicos(filtro) {
    const lista = document.getElementById('listaToxicologicos');
    const divs = lista.getElementsByClassName('toxicologico-item'); // Usa a classe correta
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

    // Exibe ou oculta a mensagem "Nenhum exame encontrado"
    const imagemResultadoToxicologico = document.getElementById('resultadoImagemToxicologico');
    if (!itemEncontrado) {
        imagemResultadoToxicologico.style.display = 'block';
    } else {
        imagemResultadoToxicologico.style.display = 'none';
    }
}

// Adiciona suporte para filtrar diferentes seções
function filtrarDados() {
    const query = document.getElementById('searchField').value.toUpperCase();
    if (currentFilter === 'motoristas') {
        fetchMotoristas(query);
    } else if (currentFilter === 'placas') {
        fetchPlacas(query);
    } else if (currentFilter === 'exames') {
        filtrarToxicologicos(query);
    }
}
