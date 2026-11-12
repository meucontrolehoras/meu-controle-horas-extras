
// Encontrar o botão e o espaço do resultado

const botao = document.getElementById("btnCalcular");

const resultado = document.getElementById("resultado");

const listaHistorico = document.getElementById("listaHistorico");


const mesHistorico = document.getElementById("mesHistorico");

const totalHorasMes = document.getElementById("totalHorasMes");


const campoSalario = document.getElementById("salario");

const campoCargaMensal = document.getElementById("cargaMensal");

const campoPercentualExtra = document.getElementById("percentualExtra");

const valorTotalExtras = document.getElementById("valorTotalExtras");


const botaoSalvar = document.getElementById("btnSalvar");

const campoData = document.getElementById("dataTrabalho");

// Recuperar a data salva
const dataSalva = localStorage.getItem("dataTrabalho");

if (dataSalva !== null) {
    campoData.value = dataSalva;
}

// Salvar a data automaticamente
campoData.addEventListener("change", function() {
    localStorage.setItem("dataTrabalho", campoData.value);
});


// compos que terão seus horarios salvos

const camposHorario = ["entrada", "almoco", "volta", "SaidaReal"];

// recuperar os horarios salvos

camposHorario.forEach(function(id) {
    const campo = document.getElementById(id);

    const horarioSalvo = localStorage.getItem(id);

    if (horarioSalvo !== null) {
        campo.value = horarioSalvo;
    } else {
        campo.value = "";
    }

    // Salvar automaticamente quando o horário mudar
    campo.addEventListener("input", function() {
        localStorage.setItem(id, campo.value);
    });
});


 
let ultimoCalculo = null;

botao.addEventListener("click", function() {
    ultimoCalculo = calcular();
});

["entrada", "almoco", "volta", "SaidaReal",
 "diaSemana", "dataTrabalho"].forEach(function(id) {

    const campo = document.getElementById(id);

    campo.addEventListener("input", function() {
        ultimoCalculo = null;
    });

});


const seletorDia = document.getElementById("diaSemana");


const diaSalvo = localStorage.getItem("diaSemana");

if (diaSalvo !== null) {
    seletorDia.value = diaSalvo;
}

seletorDia.addEventListener("change", function() {
    localStorage.setItem("diaSemana", seletorDia.value);
});


const camposAlmoco = document.getElementById("camposAlmoco");


function identificarDiaSemana() {

    const dataSelecionada = campoData.value;

    if (dataSelecionada === "") {
        return;
    }

    const partes = dataSelecionada.split("-");

    const data = new Date(
        Number(partes[0]),
        Number(partes[1]) - 1,
        Number(partes[2])
    );

    const dia = data.getDay();

    if (dia === 0) {
        alert("A data selecionada é um domingo!");
        return;
    }

    if (dia === 6) {
        seletorDia.value = "sabado";
    } else {
        seletorDia.value = "semana";
    }

    // Atualizar os campos de almoço
    atualizarCamposAlmoco();

    // Salvar o tipo de jornada
    localStorage.setItem("diaSemana", seletorDia.value);
}


function atualizarCamposAlmoco() {
    if (seletorDia.value === "sabado") {
        camposAlmoco.style.display = "none";
    } else {
        camposAlmoco.style.display = "block";
    }
}

seletorDia.addEventListener("change", atualizarCamposAlmoco);


campoData.addEventListener("change", identificarDiaSemana);


if (campoData.value !== "") {
    identificarDiaSemana();
}


atualizarCamposAlmoco();



// Criar a função de cálculo

function calcular() {

    // Pegar os horários digitados

    const diaSemana = document.getElementById("diaSemana").value;

    const jornadaNormal = diaSemana === "sabado" ? 240 : 480;


    const entrada = document.getElementById("entrada").value;

    const almoco = document.getElementById("almoco").value;

    const volta = document.getElementById("volta").value;

    const SaidaReal=document.getElementById("SaidaReal").value;




    // Verificar se os horários foram preenchidos

   
   if (entrada === "" || SaidaReal === "") {
    resultado.textContent = "Preencha a entrada e a saída!";
    return;
    }

   if (diaSemana === "semana" && (almoco === "" || volta === "")) {
     resultado.textContent = "Preencha os horários de almoço!";
     return;
    }


    // Transformar os horários em minutos

    function converterMinutos(horario) {

        const partes = horario.split(":");

        const horas = Number(partes[0]);

        const minutos = Number(partes[1]);

        return horas * 60 + minutos;
    }


    const horaEntrada = converterMinutos(entrada);

    const horaAlmoco = diaSemana === "sabado"
     ? null
     : converterMinutos(almoco);

    const horaVolta = diaSemana === "sabado"
     ? null
     : converterMinutos(volta);

    const horaSaidaReal= converterMinutos(SaidaReal)


    // Verificar a sequência dos horários

    if (diaSemana === "sabado") {

        if (horaEntrada >= horaSaidaReal) {
            resultado.textContent = "Confira a entrada e a saída!";
            return;
        }

    } else {

        if (
            horaEntrada >= horaAlmoco ||
            horaAlmoco >= horaVolta ||
            horaVolta >= horaSaidaReal
        ) {
            resultado.textContent = "Confira a sequência dos horários!";
            return;
        }
    }



    // Calcular as 8 horas normais

    
    // Calcular a jornada normal
    let fimNormal;

    if (diaSemana === "sabado") {

        // Sábado: 4 horas sem almoço
        fimNormal = horaEntrada + jornadaNormal;

    } else {

        // Segunda a sexta: 8 horas com almoço
        const trabalhadoAntesAlmoco = horaAlmoco - horaEntrada;

        const restante = jornadaNormal - trabalhadoAntesAlmoco;

        if (restante < 0) {
            resultado.textContent = "Confira os horários informados!";
            return;
        }

        fimNormal = horaVolta + restante;
    }

    // Acrescentar 2 horas extras

    const saidaMaxima = fimNormal + 120;

    const horasExtras = Math.max(0, horaSaidaReal - fimNormal);




    // Transformar os minutos novamente em horário

    function converterHorario(minutos) {

        const horas = Math.floor(minutos / 60);

        const resto = minutos % 60;

        return String(horas % 24).padStart(2, "0") + ":" +
               String(resto).padStart(2, "0");          
     }
    function formatarDuracao(minutos){
        const horas = Math.floor(minutos/60)

        const resto = minutos % 60;

        return horas + "h" + String(resto).padStart(2,"0") + " min ";
    } 


   
resultado.textContent =
    "Você poderá sair até às " +
    converterHorario(saidaMaxima) +
    ", considerando o limite de 2 horas extras." +
    "\n\n" +
    "Você realizou " +
    formatarDuracao(horasExtras) +
    "de horas extras hoje.";

    // Entregar os dados para o histórico
    return {
        diaSemana: diaSemana,
        entrada: entrada,
        almoco: almoco,
        volta: volta,
        saidaReal: SaidaReal,
        horasExtras: horasExtras
    };
}
 
botaoSalvar.addEventListener("click", function() {

    // Verificar se a data foi escolhida
    if (campoData.value === "") {
        resultado.textContent = "Selecione uma data!";
        return;
    }

    // Obter os dados calculados
   
const dados = ultimoCalculo;

if (!dados) {
    resultado.textContent = "Calcule os horários antes de salvar!";
    return;
}

    // Adicionar a data
    dados.data = campoData.value;

    // Recuperar o histórico
    const historico = JSON.parse(
        localStorage.getItem("historicoHorasExtras") || "[]"
    );

    // Adicionar o novo registro
    historico.push(dados);

    // Salvar no navegador
    localStorage.setItem(
        "historicoHorasExtras",
        JSON.stringify(historico)
    );

    resultado.textContent += "\n\n✅ Registro salvo com sucesso!";

    
    // Atualizar o histórico na tela
    mostrarHistorico();


    atualizarTotalHorasMes();


    // Evitar salvar o mesmo cálculo duas vezes
    ultimoCalculo = null;

 
});

// Função para mostrar os registros salvos
function mostrarHistorico() {

    // Buscar os registros no navegador
    
const todosRegistros = JSON.parse(
    localStorage.getItem("historicoHorasExtras") || "[]"
);

// Pegar o mês selecionado
const mesSelecionado = mesHistorico.value;

// Mostrar somente os registros do mês
const registros = todosRegistros.filter(function(registro) {
    return registro.data &&
           registro.data.startsWith(mesSelecionado);
});

    // Limpar a lista antes de mostrar
    listaHistorico.innerHTML = "";

    // Verificar se existem registros
    if (registros.length === 0) {
        listaHistorico.textContent = "Nenhum registro salvo ainda.";
        return;
    }

    // Mostrar cada registro
    
registros.forEach(function(registro, indice) {

    const linha = document.createElement("p");

    const dataFormatada = registro.data
        .split("-").reverse().join("/");

    const horas = Math.floor(registro.horasExtras / 60);
    const minutos = registro.horasExtras % 60;

    linha.textContent =
        dataFormatada + " - " +
        horas + "h" +
        String(minutos).padStart(2, "0") +
        "min extras ";

    // Criar botão Excluir
    const botaoExcluir = document.createElement("button");

    botaoExcluir.textContent = "Excluir";
    botaoExcluir.type = "button";

    botaoExcluir.addEventListener("click", function() {

        if (confirm("Deseja excluir este registro?")) {

            
const posicaoOriginal = todosRegistros.indexOf(registro);

if (posicaoOriginal === -1) {
    return;
}

todosRegistros.splice(posicaoOriginal, 1);

localStorage.setItem(
    "historicoHorasExtras",
    JSON.stringify(todosRegistros)
);

            mostrarHistorico();


            atualizarTotalHorasMes();

        }
    });

    linha.appendChild(botaoExcluir);
    listaHistorico.appendChild(linha);

 });

}

// Mostrar histórico ao abrir a página
mostrarHistorico();



const botaoVerRegistros =
    document.getElementById("btnVerRegistros");

// Começar com o histórico escondido
listaHistorico.style.display = "none";

botaoVerRegistros.textContent = "Mostrar Histórico";

// Mostrar ou ocultar os registros
botaoVerRegistros.addEventListener("click", function() {

    if (listaHistorico.style.display === "none") {

        mostrarHistorico();

        listaHistorico.style.display = "block";

        botaoVerRegistros.textContent = "Ocultar Histórico";

    } else {

        listaHistorico.style.display = "none";

        botaoVerRegistros.textContent = "Mostrar Histórico";
    }

});


    // Calcular o total de horas extras do mês
    function atualizarTotalHorasMes() {

        const mesSelecionado = mesHistorico.value;

        if (mesSelecionado === "") {
            totalHorasMes.textContent = "Selecione um mês!";
            return;
        }

        // Buscar os registros salvos
        const registros = JSON.parse(
            localStorage.getItem("historicoHorasExtras") || "[]"
        );

        let totalMinutos = 0;

        // Somar as horas do mês escolhido
        registros.forEach(function(registro) {

            if (registro.data.startsWith(mesSelecionado)) {
                totalMinutos += Number(registro.horasExtras);
            }

        });

        // Converter minutos em horas
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;

           totalHorasMes.textContent =
            "Total de horas extras: " +
            horas + "h" +
            String(minutos).padStart(2, "0") +
            "min";


         // Calcular o valor em reais das horas extras
         calcularValorExtras(totalMinutos);

    }

    // Selecionar o mês atual automaticamente
    const hoje = new Date();

    mesHistorico.value =
        hoje.getFullYear() + "-" +
        String(hoje.getMonth() + 1).padStart(2, "0");

    // Atualizar ao escolher outro mês
    
mesHistorico.addEventListener("change", function() {
    atualizarTotalHorasMes();
    mostrarHistorico();
});


    // Calcular ao abrir a página
    atualizarTotalHorasMes();


function calcularValorExtras(totalMinutos) {

    // Pegar as informações do trabalhador
    const salario = Number(campoSalario.value);
    const cargaMensal = Number(campoCargaMensal.value);
    const percentual = Number(campoPercentualExtra.value);

    // Verificar se os dados foram preenchidos
    if (salario <= 0 || cargaMensal <= 0) {
        valorTotalExtras.textContent =
            "Informe o salário e a carga horária mensal.";
        return;
    }

    // Calcular o valor da hora normal
    const valorHora = salario / cargaMensal;

    // Aplicar o adicional de hora extra
    const valorHoraExtra = valorHora * (1 + percentual / 100);

    // Converter os minutos extras em horas
    const horasExtras = totalMinutos / 60;

    // Calcular o valor total
    const totalReais = horasExtras * valorHoraExtra;

    // Mostrar o resultado em reais
    valorTotalExtras.textContent =
        "Valor estimado: " +
        totalReais.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
}


const camposValores = [
    campoSalario,
    campoCargaMensal,
    campoPercentualExtra
];
 
camposValores.forEach(function(campo) {

    // Recuperar o valor salvo
    const valorSalvo = localStorage.getItem(campo.id);

    if (valorSalvo !== null) {
        campo.value = valorSalvo;
    }

    // Salvar quando o usuário alterar o campo
    campo.addEventListener("input", function() {
        localStorage.setItem(campo.id, campo.value);
    });

});

camposValores.forEach(function(campo) {

    campo.addEventListener("input", function() {
        atualizarTotalHorasMes();
    });

});


atualizarTotalHorasMes();
