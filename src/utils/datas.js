function formatarData(dataNoFormatoYYYYMMDD) {
    if (dataNoFormatoYYYYMMDD) {
        const partes = dataNoFormatoYYYYMMDD ? dataNoFormatoYYYYMMDD.split("-") : ["00", "00", "0000"];
        if (partes.length !== 3) {
            return "Data inválida";
        }

        const ano = partes[0];
        const mes = partes[1];
        const dia = partes[2];

        return `${dia}/${mes}/${ano}`;
    }
    return `00/00/0000`;
}

function filtrarData(indiceMes, anoSelecionado, dataVerificada) {

    if (indiceMes < 0 || indiceMes > 11) {
        // Índice de mês inválido
        return false;
    }

    // Crie uma data com o mês e ano selecionados
    const dataInicio = new Date(anoSelecionado, indiceMes, 1);

    // Verifique se a data está dentro do mês selecionado
    const dataVerificadaDate = new Date(dataVerificada);
    dataVerificadaDate.setDate(dataVerificadaDate.getDate() + 1);

    return (
        dataVerificadaDate >= dataInicio && dataVerificadaDate.getMonth() === indiceMes
    );
}

function getDate() {
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda, se necessário
    const dia = String(dataAtual.getDate()).padStart(2, '0'); // Adiciona zero à esquerda, se necessário
    const dataFormatada = `${ano}-${mes}-${dia}`;
    return dataFormatada;
}

function obterDataAtual() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Lembre-se que os meses começam em 0
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

function cultoAoVivo() {
    const dataAtual = new Date();
    const diaSemana = dataAtual.getDay();
    const horaAtual = dataAtual.getHours();
    const minutosAtual = dataAtual.getMinutes();

    // Verifica se é quarta-feira entre 19:30 e 21:00
    if (diaSemana === 3 && (horaAtual === 19 && minutosAtual >= 30 || horaAtual === 20 || horaAtual === 21 && minutosAtual === 0)) {
        return true;
    }

    // Verifica se é domingo entre 09:00 e 10:30
    if (diaSemana === 0 && (horaAtual === 9 && minutosAtual >= 0 || horaAtual === 10 && minutosAtual <= 30)) {
        return true;
    }

    // Verifica se é domingo entre 19:00 e 21:00
    if (diaSemana === 0 && (horaAtual === 19 && minutosAtual >= 0 || horaAtual === 20 || horaAtual === 21 && minutosAtual === 0)) {
        return true;
    }

    // Caso não esteja em nenhum desses horários, retorna false
    return false;
}

export { formatarData, getDate, filtrarData, obterDataAtual, cultoAoVivo };