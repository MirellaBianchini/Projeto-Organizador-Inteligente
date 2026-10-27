// Seleção dos elementos HTML
const formTarefa = document.getElementById('form-tarefa');
const inputNome = document.getElementById('input-nome');
const inputMateria = document.getElementById('input-materia');
const inputHoras = document.getElementById('input-horas');
const inputNota = document.getElementById('input-nota');
const inputData = document.getElementById('input-data');
const inputPrioridade = document.getElementById('input-prioridade');

const containerTarefas = document.getElementById('container-tarefas');
const textoProgresso = document.getElementById('texto-progresso');
const barraPreenchida = document.getElementById('barra-preenchida');

// Dados armazenados no LocalStorage
let listaTarefas = JSON.parse(localStorage.getItem('estudos_tarefas_v3')) || [];

// Salva a lista no LocalStorage
function salvarDados() {
    localStorage.setItem('estudos_tarefas_v3', JSON.stringify(listaTarefas));
}

// Formata data ISO (AAAA-MM-DD) para padrão brasileiro (DD/MM/AAAA)
function formatarDataBR(dataISO) {
    if (!dataISO) return '-';
    const partes = dataISO.split('-');
    if (partes.length !== 3) return dataISO;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Calcula e atualiza a barra de progresso
function calcularProgresso() {
    if (listaTarefas.length === 0) {
        textoProgresso.innerText = '0%';
        barraPreenchida.style.width = '0%';
        return;
    }

    const concluidas = listaTarefas.filter(t => t.concluida).length;
    const porcentagem = Math.round((concluidas / listaTarefas.length) * 100);

    textoProgresso.innerText = `${porcentagem}%`;
    barraPreenchida.style.width = `${porcentagem}%`;
}

// Renderiza todas as tarefas na página
function atualizarTela() {
    containerTarefas.innerHTML = '';

    if (listaTarefas.length === 0) {
        containerTarefas.innerHTML = '<p style="text-align: center; font-size: 0.88rem; color: #666; padding: 15px 0;">Nenhuma atividade cadastrada no momento.</p>';
        calcularProgresso();
        return;
    }

    listaTarefas.forEach((tarefa, indice) => {
        const cartao = document.createElement('div');
        cartao.className = `cartao-estudo ${tarefa.concluida ? 'concluida' : ''}`;

        const horasTexto = tarefa.horas ? `${tarefa.horas}h` : '0h';
        const notaTexto = tarefa.nota ? `Nota: ${tarefa.nota}` : 'Nota: -';
        const textoDetalhes = `Matéria: ${tarefa.materia} • Horas: ${horasTexto} • ${notaTexto}`;

        cartao.innerHTML = `
            <div class="info-tarefa">
                <h3>${tarefa.nome}</h3>
                <div class="detalhes-materia">${textoDetalhes}</div>
                <div class="meta-info">Data Limite: ${formatarDataBR(tarefa.data)} | Prioridade: ${tarefa.prioridade}</div>
            </div>
            <div class="botoes-acao">
                <button class="btn-ok" onclick="mudarStatus(${indice})">${tarefa.concluida ? 'Desfazer' : 'Concluir'}</button>
                <button class="btn-del" onclick="removerTarefa(${indice})">Excluir</button>
            </div>
        `;

        containerTarefas.appendChild(cartao);
    });

    calcularProgresso();
}

// Evento de cadastro do formulário
formTarefa.addEventListener('submit', function(e) {
    e.preventDefault();

    const novaTarefa = {
        nome: inputNome.value.trim(),
        materia: inputMateria.value.trim(),
        horas: inputHoras.value,
        nota: inputNota.value,
        data: inputData.value,
        prioridade: inputPrioridade.value,
        concluida: false
    };

    listaTarefas.push(novaTarefa);
    salvarDados();
    atualizarTela();

    formTarefa.reset();
});

// Alterna estado de concluída/pendente
function mudarStatus(indice) {
    listaTarefas[indice].concluida = !listaTarefas[indice].concluida;
    salvarDados();
    atualizarTela();
}

// Exclui a tarefa da lista
function removerTarefa(indice) {
    listaTarefas.splice(indice, 1);
    salvarDados();
    atualizarTela();
}

// Inicializa a exibição na abertura da tela
atualizarTela();