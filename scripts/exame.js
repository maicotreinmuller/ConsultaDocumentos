document.addEventListener("DOMContentLoaded", function() {
    fetch('info/motoristas.json')
        .then(response => response.text())
        .then(data => {
            const toxicologicos = data.split(/\r?\n/);
            const listaToxicologicos = document.getElementById("listaToxicologicos");

            toxicologicos.forEach(nome => {
                nome = nome.trim();
                if (nome) {
                    const div = document.createElement('div');
                    div.classList.add('toxicologico-item');
                    div.innerHTML = `<span>${nome}</span>`;
                    listaToxicologicos.appendChild(div);
                    verificarEAdicionarLinkToxicologico(nome, div);
                }
            });
        });

    // Atualiza a lista de exames toxicológicos ao digitar no campo de pesquisa
    const searchFieldToxicologico = document.getElementById('searchFieldToxicologico');
    searchFieldToxicologico.addEventListener('input', filtrarToxicologicos);

    const filtroToxicologicoInput = document.getElementById('filtroToxicologico');
    filtroToxicologicoInput.addEventListener('input', filtrarToxicologicos);
});

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
                    throw new Error('Arquivo encontrado'); // Interrompe a busca após encontrar um arquivo
                }
            })
            .catch(error => {
                if (error.message !== 'Arquivo encontrado') {
                    console.log(error.message);
                }
            });
    });
}

function filtrarToxicologicos() {
    const filtro = searchFieldToxicologico.value.toUpperCase(); // Usando o valor do campo de pesquisa
    const lista = document.getElementById('listaToxicologicos');
    const divs = lista.getElementsByClassName('toxicologico-item');
    let itemEncontrado = false;

    for (let i = 0; i < divs.length; i++) {
        let toxicologico = divs[i].getElementsByTagName('span')[0];
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
