class Despesas {

    constructor(dia, mes, ano, tipo, descricao, valor) {
        this.dia = dia;
        this.mes = mes;
        this.ano = ano;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validarDados() {
        for (let i in this) {
            if (this[i] == null || this[i] == undefined || this[i] == '') {
                return false;
            }
        }
        return true;
    }

}

class Bd {

    constructor() {
        let id = localStorage.getItem('id');

        if (id === null) {
            localStorage.setItem('id', 0);
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    gravarDespesa(d) {
        // Convertento em objeto JSON
        // localStorage.setItem -> Recebe dois parametros
        //localStorage.setItem('id', JSON.stringify(d));

        let id = this.getProximoId();

        localStorage.setItem(id, JSON.stringify(d));

        localStorage.setItem('id', id);

    }

    recuperarTodosRegistros() {

        let despesas = Array();

        let id = localStorage.getItem('id');

        // recuperar todas as despesas cadastradas LocalStorage
        for (let i = 1; i <= id; i++) {
            // convertendo objeto JSON para Objeto Literal
            let despesa = JSON.parse(localStorage.getItem(i));

            if (despesa === null || despesa === undefined) {
                continue;
            }

            despesa.id = i;
            despesas.push(despesa);
        }
        return despesas;

    }
    pesquisar(despesa) {
        let despesasFiltradas = Array();
        despesasFiltradas = this.recuperarTodosRegistros();

        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }

        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
        }

        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
        }

        if (despesa.tipo != '') {
            despesasFiltradas.filter(d => d.tipo == despesa.tipo);
        }

        if (despesa.descricao != '') {
            despesasFiltradas.filter(d => d.descricao == despesa.descricao);
        }

        if (despesa.valor != '') {
            despesasFiltradas.filter(d => d.valor == despesa.valor);
        }

        return despesasFiltradas;

    }
    remover(id) {
        localStorage.removeItem(id);
    }
}

let bd = new Bd();

function cadastrarDespesas() {
    let dia = document.getElementById('dia').value;
    let mes = document.getElementById('mes').value;
    let ano = document.getElementById('ano').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesas(dia, mes, ano, tipo, descricao, valor);

    if (despesa.validarDados() === true) {

        bd.gravarDespesa(despesa); //Gravar dados no BD

        document.getElementById('modalTitulo').innerHTML = 'Registro inserido sucesso';

        document.getElementById('conteudo').innerHTML =
            'Despesa cadastrada com sucesso.';

        document.getElementById('botao').className = 'btn btn-success';

        document.getElementById('mensagem').className = 'modal-header text-success';

        $('#modalRegitraDespesa').modal('show');

        dia.value = '';
        mes.value = '';
        ano.value = '';
        tipo.value = '';
        valor.value = '';
        descricao.value = '';

    } else {
        document.getElementById('modalTitulo').innerHTML = 'Erro ao inserir Registro';

        document.getElementById('conteudo').innerHTML =
            'Existem campos não Preenchidos.';

        document.getElementById('botao').className = 'btn btn-danger';

        document.getElementById('mensagem').className = 'modal-header text-danger';

        $('#modalRegitraDespesa').modal('show');
    }

}
function carregaListaDespesa(despesas = Array(), filtro = false) {

    if (despesas == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros();
    }


    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';

    despesas.forEach(function (d) {

        //criando linhas (tr)
        let linha = listaDespesas.insertRow();
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;

        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

        // adicionando o btn remover

        let btn = document.createElement('button');
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = `id_despesa_ ${d.id}`;
        btn.onclick = function () {
            let id = this.id.replace('id_despesa_ ', '');
            bd.remover(id);
            $('#modalRegitraDespesa').modal('show');
            window.location.reload();
        }
        linha.insertCell(4).append(btn);
    });

}

function pesquisarDespesa() {
    let dia = document.getElementById('dia').value;
    let mes = document.getElementById('mes').value;
    let ano = document.getElementById('ano').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesas(ano, mes, dia, tipo, descricao, valor);

    let despesas = bd.pesquisar(despesa);

    this.carregaListaDespesa(despesas, true);
}

function modalBtn() {

}

