document.addEventListener("DOMContentLoaded", function() {
    fetch('info/motoristas.json')
        .then(response => response.text())
        .then(data => {
            const motoristas = data.split(/\r?\n/);
            const lista = document.getElementById("listaMotoristas");

            motoristas.forEach(nome => {
                nome = nome.trim();
                if (nome) {
                    const div = document.createElement('div');
                    div.classList.add('motorista-item');
                    div.innerHTML = `<span>${nome}</span>`;
                    lista.appendChild(div);
                    verificarEAdicionarLink(nome, div);
                }
            });
        });

    // Atualiza a lista de motoristas ao digitar no campo de pesquisa
    const searchField = document.getElementById('searchField');
    searchField.addEventListener('input', filtrarMotoristas);

    const filtroMotoristaInput = document.getElementById('filtroMotorista');
    filtroMotoristaInput.addEventListener('input', filtrarMotoristas);
});

function verificarEAdicionarLink(nome, div) {
    const extensoes = ['pdf', 'jpg', 'jpeg', 'png']; // Adicione mais extensões se necessario
    const basePath = `download/cnh/${nome}.`;

    extensoes.forEach(ext => {
        fetch(basePath + ext)
            .then(response => {
                if (response.status === 200) {
                    const link = document.createElement('a');
                    link.href = basePath + ext;
                    link.classList.add('button-visualizar');
                    link.target = '_blank';
                    link.textContent = 'Baixar CNH';
                    div.appendChild(link);
                    throw new Error('Arquivo encontrado');
                }
            })
            .catch(error => {
                console.log(error.message);
            });
    });
}

function filtrarMotoristas() {
    const filtro = searchField.value.toUpperCase(); // Usando o valor do campo de pesquisa
    const lista = document.getElementById('listaMotoristas');
    const divs = lista.getElementsByClassName('motorista-item');
    let itemEncontrado = false;

    for (let i = 0; i < divs.length; i++) {
        let motorista = divs[i].getElementsByTagName('span')[0];
        if (motorista) {
            if (motorista.innerHTML.toUpperCase().indexOf(filtro) > -1) {
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
