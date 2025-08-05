// function trocaImg() {
//     const img = document.querySelector('.main-img');
//     img.src = '../src/img/Ana Livia.png';
// }

// Função para enviar agendamento via WhatsApp
function enviarWhatsApp(agendamento) {
    const nome = agendamento.nome;
    const telefone = agendamento.telefone;
    const data = agendamento.data;
    const hora = agendamento.hora;
    const servico = agendamento.servico;

    // Substitua pelo seu número com DDD e sem espaços, exemplo: 5538992702823
    const numeroWhatsApp = '5538992702823';

    const mensagem = `Olá! Gostaria de agendar um horário:%0A` +
        `*Nome:* ${nome}%0A` +
        `*Telefone:* ${telefone}%0A` +
        `*Data:* ${data}%0A` +
        `*Horário:* ${hora}%0A` +
        `*Serviço:* ${servico}`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;

    window.open(url, '_blank');
}

function salvarAgendamentoLocal(agendamento) {
    try {
        let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        agendamentos.push(agendamento);
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        console.log('Agendamento salvo com sucesso:', agendamento);
        console.log('Total de agendamentos:', agendamentos.length);
        return true;
    } catch (error) {
        console.error('Erro ao salvar agendamento:', error);
        return false;
    }
}

// Função para limpar todos os agendamentos (útil para debug)
function limparAgendamentos() {
    try {
        localStorage.removeItem('agendamentos');
        console.log('Agendamentos limpos com sucesso');
        mostrarAgendamentos();
        gerarCalendario(mesAtual, anoAtual);
        return true;
    } catch (error) {
        console.error('Erro ao limpar agendamentos:', error);
        return false;
    }
}

// Função para limpar seleção do calendário e mostrar todos os agendamentos
function limparSelecaoCalendario() {
    // Remover destaque do dia selecionado
    const todosDias = document.querySelectorAll('.dia-calendario');
    todosDias.forEach(d => d.classList.remove('selecionado'));

    // Limpar input de data
    const dataInput = document.getElementById('data-agendamento');
    if (dataInput) {
        dataInput.value = '';
    }

    // Limpar texto da data selecionada
    const dataSelecionadaTexto = document.getElementById('data-selecionada-texto');
    if (dataSelecionadaTexto) {
        dataSelecionadaTexto.textContent = 'Nenhuma data selecionada';
    }

    // Limpar seleção do select de horários
    const horaInput = document.getElementById('hora-agendamento');
    if (horaInput) {
        horaInput.innerHTML = '<option value="">Selecione uma data primeiro</option>';
    }

    // Esconder container de horários disponíveis
    const container = document.getElementById('horarios-disponiveis-container');
    if (container) {
        container.style.display = 'none';
    }

    // Mostrar todos os agendamentos
    mostrarAgendamentos();
}

// Função para mostrar todos os agendamentos no console (debug)
function debugAgendamentos() {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    console.log('Agendamentos salvos:', agendamentos);
    console.log('Total de agendamentos:', agendamentos.length);

    // Mostrar agendamentos formatados
    if (agendamentos.length > 0) {
        console.log('Agendamentos formatados:');
        agendamentos.forEach((a, i) => {
            const dataFormatada = formatarData(a.data);
            console.log(`${i + 1}. ${dataFormatada} às ${a.hora} - ${a.nome} (${a.servico})`);
        });
    }

    return agendamentos;
}

// Função para testar formatação de data
function testarData() {
    const dataInput = document.getElementById('data-agendamento');
    if (dataInput && dataInput.value) {
        const dataOriginal = dataInput.value;
        const dataFormatada = formatarData(dataOriginal);
        console.log('Teste de formatação de data:');
        console.log('Data original (input):', dataOriginal);
        console.log('Data formatada:', dataFormatada);
        console.log('Data como objeto Date:', new Date(dataOriginal + 'T00:00:00'));
        alert(`Data original: ${dataOriginal}\nData formatada: ${dataFormatada}`);
    } else {
        alert('Por favor, selecione uma data primeiro no formulário.');
    }
}

// Variáveis globais para o calendário
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();

// Função para formatar data no formato brasileiro
function formatarData(dataISO) {
    try {
        // Verificar se a data já está no formato correto
        if (!dataISO || typeof dataISO !== 'string') {
            console.error('Data inválida:', dataISO);
            return 'Data inválida';
        }

        // Se a data já estiver no formato DD/MM/YYYY, retornar como está
        if (dataISO.includes('/')) {
            return dataISO;
        }

        // Processar data no formato YYYY-MM-DD sem problemas de fuso horário
        const partes = dataISO.split('-');
        if (partes.length !== 3) {
            console.error('Formato de data inválido:', dataISO);
            return dataISO;
        }

        const ano = partes[0];
        const mes = partes[1];
        const dia = partes[2];

        // Verificar se os valores são válidos
        if (isNaN(ano) || isNaN(mes) || isNaN(dia)) {
            console.error('Valores de data inválidos:', dataISO);
            return dataISO;
        }

        console.log(`Formatando data: ${dataISO} -> ${dia}/${mes}/${ano}`);
        return `${dia}/${mes}/${ano}`;
    } catch (error) {
        console.error('Erro ao formatar data:', error, 'Data original:', dataISO);
        return dataISO; // Retorna a data original se houver erro
    }
}

// Função para mostrar agendamentos
function mostrarAgendamentos(dataFiltro = null) {
    const lista = document.getElementById('lista-agendamentos');
    if (!lista) return;

    lista.innerHTML = '';
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

    if (agendamentos.length === 0) {
        lista.innerHTML = '<li>Nenhum agendamento salvo.</li>';
        return;
    }

    // Filtrar agendamentos por data se especificado
    let agendamentosFiltrados = agendamentos;
    if (dataFiltro) {
        agendamentosFiltrados = agendamentos.filter(a => a.data === dataFiltro);
    }

    if (agendamentosFiltrados.length === 0) {
        if (dataFiltro) {
            const dataFormatada = formatarData(dataFiltro);
            lista.innerHTML = `<li>Nenhum agendamento para ${dataFormatada}.</li>`;
        } else {
            lista.innerHTML = '<li>Nenhum agendamento salvo.</li>';
        }
        return;
    }

    // Adicionar título indicando se está filtrando ou mostrando todos
    if (dataFiltro) {
        const dataFormatada = formatarData(dataFiltro);
        const titulo = document.createElement('li');
        titulo.style.fontWeight = 'bold';
        titulo.style.color = '#007bff';
        titulo.style.marginBottom = '10px';
        titulo.textContent = `Agendamentos para ${dataFormatada}:`;
        lista.appendChild(titulo);
    }

    // Ordenar agendamentos por data e hora
    agendamentosFiltrados.sort((a, b) => {
        const dataA = new Date(a.data + 'T' + a.hora);
        const dataB = new Date(b.data + 'T' + b.hora);
        return dataA - dataB;
    });

    agendamentosFiltrados.forEach((a, i) => {
        const li = document.createElement('li');
        const dataFormatada = formatarData(a.data);
        li.textContent = `${dataFormatada} às ${a.hora} - ${a.nome} (${a.servico})`;
        lista.appendChild(li);
    });
}

// Função para gerar o calendário
function gerarCalendario(mes, ano) {
    const diasCalendario = document.getElementById('dias-calendario');
    const mesAtualElement = document.getElementById('mes-atual');

    if (!diasCalendario || !mesAtualElement) return;

    // Nomes dos meses
    const nomesMeses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // Atualizar título do mês
    mesAtualElement.textContent = `${nomesMeses[mes]} ${ano}`;

    // Obter primeiro dia do mês e último dia
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diaSemanaInicio = primeiroDia.getDay();
    const totalDias = ultimoDia.getDate();

    // Obter agendamentos para marcar no calendário
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    const agendamentosPorDia = {};

    agendamentos.forEach(agendamento => {
        // Extrair ano, mês e dia da string de data sem problemas de fuso horário
        const partes = agendamento.data.split('-');
        if (partes.length === 3) {
            const anoAgendamento = parseInt(partes[0]);
            const mesAgendamento = parseInt(partes[1]) - 1; // Mês começa em 0 no JavaScript
            const diaAgendamento = parseInt(partes[2]);

            if (mesAgendamento === mes && anoAgendamento === ano) {
                if (!agendamentosPorDia[diaAgendamento]) {
                    agendamentosPorDia[diaAgendamento] = [];
                }
                agendamentosPorDia[diaAgendamento].push(agendamento);
            }
        }
    });

    // Limpar calendário
    diasCalendario.innerHTML = '';

    // Adicionar dias do mês anterior (para completar a primeira semana)
    const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
        const dia = document.createElement('div');
        dia.className = 'dia-calendario outro-mes';
        dia.textContent = ultimoDiaMesAnterior - i;
        diasCalendario.appendChild(dia);
    }

    // Adicionar dias do mês atual
    const hoje = new Date();
    // Para destacar o dia selecionado
    const dataInput = document.getElementById('data-agendamento');
    let dataSelecionada = null;
    if (dataInput && dataInput.value) {
        const partes = dataInput.value.split('-');
        if (partes.length === 3) {
            const anoSelecionado = parseInt(partes[0]);
            const mesSelecionado = parseInt(partes[1]) - 1; // Mês começa em 0 no JavaScript
            const diaSelecionado = parseInt(partes[2]);
            dataSelecionada = new Date(anoSelecionado, mesSelecionado, diaSelecionado);
        }
    }
    for (let dia = 1; dia <= totalDias; dia++) {
        const diaElement = document.createElement('div');
        diaElement.className = 'dia-calendario';
        diaElement.textContent = dia;

        // Marcar como hoje
        if (dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()) {
            diaElement.classList.add('hoje');
        }

        // Marcar dias com agendamentos
        if (agendamentosPorDia[dia]) {
            diaElement.classList.add('com-agendamento');

            // Criar tooltip detalhado com horários ocupados
            const horariosOcupados = agendamentosPorDia[dia].map(a => a.hora).sort();
            const tooltipText = `${agendamentosPorDia[dia].length} agendamento(s)\nHorários ocupados: ${horariosOcupados.join(', ')}`;
            diaElement.title = tooltipText;
        }

        // Destacar o dia selecionado
        if (
            dataSelecionada &&
            dia === dataSelecionada.getDate() &&
            mes === dataSelecionada.getMonth() &&
            ano === dataSelecionada.getFullYear()
        ) {
            diaElement.classList.add('selecionado');
        }

        // Permitir selecionar apenas dias válidos (não passados, não finais de semana)
        const dataDoDia = new Date(ano, mes, dia);
        const hojeLimpo = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        if (dataDoDia >= hojeLimpo && dataDoDia.getDay() !== 0 && dataDoDia.getDay() !== 6) {
            diaElement.style.cursor = 'pointer';
            diaElement.addEventListener('click', function () {
                // Preencher o input de data
                if (dataInput) {
                    const yyyy = ano;
                    const mm = String(mes + 1).padStart(2, '0');
                    const dd = String(dia).padStart(2, '0');
                    const dataSelecionada = `${yyyy}-${mm}-${dd}`;
                    dataInput.value = dataSelecionada;

                    // Mostrar horários disponíveis para esta data
                    mostrarHorariosDisponiveis(dataSelecionada);

                    // Mostrar apenas os agendamentos do dia selecionado
                    mostrarAgendamentos(dataSelecionada);

                    // Disparar evento para atualizar restrições de horário
                    dataInput.dispatchEvent(new Event('input'));
                }
                // Atualizar destaque visual
                const todosDias = document.querySelectorAll('.dia-calendario');
                todosDias.forEach(d => d.classList.remove('selecionado'));
                diaElement.classList.add('selecionado');
            });
        } else {
            diaElement.style.opacity = 0.5;
        }

        diasCalendario.appendChild(diaElement);
    }

    // Adicionar dias do próximo mês (para completar a última semana)
    const diasRestantes = 42 - (diaSemanaInicio + totalDias); // 6 semanas * 7 dias
    for (let dia = 1; dia <= diasRestantes; dia++) {
        const diaElement = document.createElement('div');
        diaElement.className = 'dia-calendario outro-mes';
        diaElement.textContent = dia;
        diasCalendario.appendChild(diaElement);
    }
}

// Sistema de horários disponíveis por dia
const HORARIOS_DISPONIVEIS = [
    '08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

// Função para obter horários disponíveis de um dia específico
function getHorariosDisponiveis(data) {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    const agendamentosDoDia = agendamentos.filter(a => a.data === data);
    const horariosOcupados = agendamentosDoDia.map(a => a.hora);

    return HORARIOS_DISPONIVEIS.filter(horario => !horariosOcupados.includes(horario));
}

// Função para mostrar horários disponíveis quando um dia é selecionado
function mostrarHorariosDisponiveis(data) {
    const horariosDisponiveis = getHorariosDisponiveis(data);
    const horaInput = document.getElementById('hora-agendamento');
    const container = document.getElementById('horarios-disponiveis-container');
    const lista = document.getElementById('horarios-disponiveis-lista');
    const totalSpan = document.getElementById('total-horarios');

    if (horaInput) {
        // Limpar opções existentes
        horaInput.innerHTML = '';

        // Adicionar opção padrão
        const optionPadrao = document.createElement('option');
        optionPadrao.value = '';
        optionPadrao.textContent = 'Selecione um horário';
        horaInput.appendChild(optionPadrao);

        // Adicionar horários disponíveis
        horariosDisponiveis.forEach(horario => {
            const option = document.createElement('option');
            option.value = horario;
            option.textContent = horario;
            horaInput.appendChild(option);
        });

        // Mostrar quantidade de horários disponíveis
        const dataSelecionadaTexto = document.getElementById('data-selecionada-texto');
        if (dataSelecionadaTexto) {
            const dataFormatada = formatarData(data);
            dataSelecionadaTexto.textContent = `${dataFormatada} (${horariosDisponiveis.length} horários disponíveis)`;
        }
    }

    // Mostrar container de horários disponíveis
    if (container && lista && totalSpan) {
        // Limpar lista anterior
        lista.innerHTML = '';

        if (horariosDisponiveis.length > 0) {
            // Mostrar container
            container.style.display = 'block';

            // Adicionar horários como badges
            horariosDisponiveis.forEach(horario => {
                const badge = document.createElement('span');
                badge.textContent = horario;
                badge.style.cssText = `
                    display: inline-block;
                    padding: 6px 12px;
                    background: #007bff;
                    color: white;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                `;

                // Adicionar hover effect
                badge.addEventListener('mouseenter', () => {
                    badge.style.background = '#0056b3';
                });

                badge.addEventListener('mouseleave', () => {
                    badge.style.background = '#007bff';
                });

                // Selecionar horário ao clicar
                badge.addEventListener('click', () => {
                    if (horaInput) {
                        horaInput.value = horario;
                        // Disparar evento para validar
                        horaInput.dispatchEvent(new Event('change'));
                    }
                });

                lista.appendChild(badge);
            });

            // Atualizar total
            totalSpan.textContent = horariosDisponiveis.length;
        } else {
            // Mostrar mensagem quando não há horários disponíveis
            container.style.display = 'block';

            const mensagem = document.createElement('div');
            mensagem.style.cssText = `
                padding: 10px;
                background: #fff3cd;
                color: #856404;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                text-align: center;
                font-weight: 500;
            `;
            mensagem.textContent = 'Não há horários disponíveis para esta data.';
            lista.appendChild(mensagem);

            // Atualizar total
            totalSpan.textContent = '0';
        }
    }
}

// Adiciona o evento ao formulário de agendamento, se existir na página
document.addEventListener('DOMContentLoaded', function () {
    const formAgendamento = document.getElementById('form-agendamento');

    if (formAgendamento) {
        // Remove event listeners anteriores para evitar duplicação
        formAgendamento.removeEventListener('submit', handleFormSubmit);

        // Adiciona o novo event listener
        formAgendamento.addEventListener('submit', handleFormSubmit);

        // Carrega agendamentos existentes (todos)
        mostrarAgendamentos();
    }

    // Função unificada para lidar com o envio do formulário
    function handleFormSubmit(event) {
        event.preventDefault();

        const nome = document.getElementById('nome-agendamento').value;
        const telefone = document.getElementById('telefone-agendamento').value;
        const data = document.getElementById('data-agendamento').value;
        const hora = document.getElementById('hora-agendamento').value;
        const servico = document.getElementById('servico-agendamento').value;

        // Validações
        if (!nome || !telefone || !data || !hora || !servico) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Verificar se uma data foi selecionada
        if (!data) {
            alert('Por favor, selecione uma data no calendário.');
            return;
        }

        // Validação de data sem problemas de fuso horário
        const partes = data.split('-');
        if (partes.length !== 3) {
            alert('Data inválida.');
            return;
        }

        const anoSelecionado = parseInt(partes[0]);
        const mesSelecionado = parseInt(partes[1]) - 1; // Mês começa em 0 no JavaScript
        const diaSelecionado = parseInt(partes[2]);

        // Criar data para validação
        const dataSelecionada = new Date(anoSelecionado, mesSelecionado, diaSelecionado);
        const diaSemana = dataSelecionada.getDay();

        // Data de hoje para comparação
        const hoje = new Date();
        const dataHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

        if (dataSelecionada < dataHoje) {
            alert('Não é possível agendar para dias que já passaram.');
            return;
        }

        if (diaSemana === 0 || diaSemana === 6) {
            alert('Selecione um dia útil (segunda a sexta-feira).');
            return;
        }

        // Validação de horário
        if (hora < "08:00" || hora > "17:00" || (hora >= "12:00" && hora < "13:00")) {
            alert('Selecione um horário entre 08:00 e 12:00 ou entre 13:00 e 17:00 (horário de almoço bloqueado).');
            return;
        }

        // Verificar se horário já está agendado
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        const existe = agendamentos.some(a => a.data === data && a.hora === hora);
        if (existe) {
            alert('Este horário já está agendado para esta data. Escolha outro horário.');
            return;
        }

        // Criar objeto do agendamento
        const agendamento = {
            nome,
            telefone,
            data: data, // Data no formato YYYY-MM-DD
            hora,
            servico,
            dataCriacao: new Date().toISOString(),
            dataFormatada: formatarData(data) // Data formatada para exibição
        };

        // Debug: mostrar dados que serão salvos
        console.log('Dados do agendamento a serem salvos:', agendamento);
        console.log('Data original:', data);
        console.log('Data formatada:', formatarData(data));

        // Salvar localmente
        const salvou = salvarAgendamentoLocal(agendamento);

        if (salvou) {
            // Atualizar interface
            mostrarAgendamentos(); // Mostrar todos os agendamentos após salvar
            gerarCalendario(mesAtual, anoAtual);

            // Limpar formulário
            formAgendamento.reset();

            // Se ainda há uma data selecionada, atualizar os horários disponíveis
            const dataAtual = document.getElementById('data-agendamento').value;
            if (dataAtual) {
                mostrarHorariosDisponiveis(dataAtual);
            }

            // Limpar texto da data selecionada
            const dataSelecionadaTexto = document.getElementById('data-selecionada-texto');
            if (dataSelecionadaTexto) {
                dataSelecionadaTexto.textContent = 'Nenhuma data selecionada';
            }

            // Limpar seleção do select de horários
            const horaInput = document.getElementById('hora-agendamento');
            if (horaInput) {
                horaInput.innerHTML = '<option value="">Selecione uma data primeiro</option>';
            }

            // Esconder container de horários disponíveis
            const container = document.getElementById('horarios-disponiveis-container');
            if (container) {
                container.style.display = 'none';
            }

            // Remover destaque do dia selecionado
            const todosDias = document.querySelectorAll('.dia-calendario');
            todosDias.forEach(d => d.classList.remove('selecionado'));

            // Mostrar confirmação
            alert('Agendamento salvo com sucesso!');

            // Enviar via WhatsApp
            enviarWhatsApp(agendamento);
        } else {
            alert('Erro ao salvar agendamento. Tente novamente.');
        }
    }

    // Bloqueio de horários fora do expediente (08h às 17h), horário de almoço (12h às 13h) e horários já agendados

    const dataInput = document.getElementById('data-agendamento');
    const horaInput = document.getElementById('hora-agendamento');

    // Função para obter agendamentos salvos
    function getAgendamentos() {
        return JSON.parse(localStorage.getItem('agendamentos')) || [];
    }

    // Bloqueia horários fora do intervalo 08:00 às 17:00, horário de almoço 12:00 às 13:00 e horários já agendados
    if (horaInput) {
        horaInput.min = "08:00";
        horaInput.max = "17:00";
        horaInput.addEventListener('input', function () {
            const hora = this.value;
            const data = dataInput.value;

            // Verificar se uma data foi selecionada
            if (!data) {
                alert('Por favor, selecione uma data no calendário primeiro.');
                this.value = '';
                return;
            }

            if (hora < "08:00" || hora > "17:00" || (hora >= "12:00" && hora < "13:00")) {
                alert('Selecione um horário entre 08:00 e 12:00 ou entre 13:00 e 17:00 (horário de almoço bloqueado).');
                this.value = '';
                return;
            }
            // Bloqueio de horários já agendados
            const agendamentos = getAgendamentos();
            const existe = agendamentos.some(a => a.data === data && a.hora === hora);
            if (existe) {
                alert('Este horário já está agendado para esta data. Escolha outro horário.');
                this.value = '';
            }
        });
    }

    // Inicializar calendário
    gerarCalendario(mesAtual, anoAtual);

    // Event listeners para navegação do calendário
    const btnMesAnterior = document.getElementById('mes-anterior');
    const btnMesProximo = document.getElementById('mes-proximo');

    if (btnMesAnterior) {
        btnMesAnterior.addEventListener('click', function () {
            mesAtual--;
            if (mesAtual < 0) {
                mesAtual = 11;
                anoAtual--;
            }
            gerarCalendario(mesAtual, anoAtual);
        });
    }

    if (btnMesProximo) {
        btnMesProximo.addEventListener('click', function () {
            mesAtual++;
            if (mesAtual > 11) {
                mesAtual = 0;
                anoAtual++;
            }
            gerarCalendario(mesAtual, anoAtual);
        });
    }

    // ...restante do seu código
});