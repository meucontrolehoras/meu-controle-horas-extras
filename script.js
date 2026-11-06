
// Encontrar o botão e o espaço do resultado

const botao = document.getElementById("btnCalcular");

const resultado = document.getElementById("resultado");

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

// Quando clicar no botão, executar a função

botao.addEventListener("click", calcular);


// Criar a função de cálculo

function calcular() {

    // Pegar os horários digitados

    const entrada = document.getElementById("entrada").value;

    const almoco = document.getElementById("almoco").value;

    const volta = document.getElementById("volta").value;

    const SaidaReal=document.getElementById("SaidaReal").value;




    // Verificar se os horários foram preenchidos

    if (entrada === "" || almoco === "" || volta === "" || SaidaReal === "") {

        resultado.textContent = "Preencha todos os horários!";

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

    const horaAlmoco = converterMinutos(almoco);

    const horaVolta = converterMinutos(volta);

    const horaSaidaReal= converterMinutos(SaidaReal)




    // Verificar a sequência dos horários

    if (horaEntrada >= horaAlmoco || horaAlmoco >= horaVolta || horaAlmoco >= horaSaidaReal) {


        resultado.textContent = "Confira a sequência dos horários!";

        return;
    }


    // Calcular as 8 horas normais

    const trabalhadoAntesAlmoco = horaAlmoco - horaEntrada;

    const restante = 480 - trabalhadoAntesAlmoco;


    if (restante < 0) {

        resultado.textContent = "Confira os horários informados!";

        return;
    }


    const fimNormal = horaVolta + restante;

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


    // Mostrar o resultado na página

    resultado.textContent =
    "Você poderá sair até às " +
    converterHorario(saidaMaxima) +
    ", considerando o limite de 2 horas extras." + " Você realizou " + formatarDuracao(horasExtras) + "de horas extras hoje";
}