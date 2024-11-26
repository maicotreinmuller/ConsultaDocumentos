document.addEventListener("DOMContentLoaded", function() {
    fetch('info/placas.json')
        .then(response => response.text())
        .then(data => {
            const placas = data.split(/\r?\n/);
            const lista = document.getElementById("listaPlacas");
            placas.forEach(placa => {
                if (placa) {
                    const div = document.createElement('div');
                    div.classList.add('placa-item');
                    div.innerHTML = `
                        <span>${placa}</span>
                    	<a href="download/crlv/${placa.trim()}.pdf" class="button-visualizar" target="_blank">Baixar CRLV</a>
                    `;
                    lista.appendChild(div);
                }
            });
        });

    // Atualiza a lista de placas ao digitar no campo de pesquisa
    const searchField = document.getElementById('searchField');
    searchField.addEventListener('input', filtrarPlacas);

    const filtroPlacaInput = document.getElementById('filtroPlaca');
    filtroPlacaInput.addEventListener('input', filtrarPlacas);
});

function filtrarPlacas() {
    const filtro = searchField.value.toUpperCase(); // Usando o valor do campo de pesquisa
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
