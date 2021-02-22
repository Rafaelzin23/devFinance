let Modal = {
  open() {
    //Abri Modal
    // Adicionar a classe active ao modal
    document
    .querySelector('.modal-overlay')
    .classList
    .add('active');
  },
  close() {
    //fecha o modal
    // remover a classe active do modal
    document
    .querySelector('.modal-overlay')
    .classList
    .remove('active');
  }

};


const Storage = {
  get () {
    // Comando JSON abaixo, está transformando o Array de String abaixo,
    // Em Array novamente
    return JSON.parse(localStorage.getItem("dev.finances:transactions"))
    || [];
  },

  set(transactions) {
    //JSON.stringity, é uma função JSON que está transformando o Array
    // em uma String
    localStorage.setItem("dev.finances:transactions",
    JSON.stringify(transactions))
  }
};

const Transaction = {
  // Essa variavel Storage.get está Armazenando as Informaçoes
  // Das transactions em uma pasta Local que Existe no Browser
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction)

    App.reload()
  },

  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },

  incomes() {

    let income = 0;
    Transaction.all.forEach(transaction => {
      if( transaction.amount > 0) {

        income += transaction.amount;
      }
    })

    return income;
  },

  expenses() {
    let expense = 0;

    Transaction.all.forEach(transaction => {

      if( transaction.amount < 0) {

        expense += transaction.amount;
      }
    })

    return expense;
  },

  total() {
    
    return Transaction.incomes() + Transaction.expenses();
  }
};

//

  /* tr.innerHTML, está pegando o Objeto criado acima e está
       addicionando dentro da variavel a const DOM.innerHTMLTransaction
       e dentro da DOM.innerHTMLTransacation, está Jogando outra
      variavel que se chama transaction, que está criada la em cima. */

     //document.createElemente, está criando um objeto chamado 'tr'

const DOM = {  

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
      const tr = document.createElement('tr')
      tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
      tr.dataset.index = index;
      DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction (transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="/assets/minus.svg" id="remove" alt="remove transação">
        </td>
        `
        return html
  },

  updateBalance() {
    document
    .getElementById('incomeDisplay')
    .innerHTML = Utils.formatCurrency(Transaction.incomes
    ())
    document
    .getElementById('expenseDisplay')
    .innerHTML = Utils.formatCurrency(Transaction.expenses
    ())
    document
    .getElementById('totalDisplay')
    .innerHTML = Utils.formatCurrency(Transaction.total
    ())
  },

  clearTransactions () {
    DOM.transactionsContainer.innerHTML = "";
  }

};

const Utils = {

  formatAmount (value) {
      value = Number(value.replace(/\,\./g, "")) * 100

      return value
  },

  formatDate(date) {
    const splittedDate = date.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g, "")

    value = Number(value) / 100
    
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
    
    return signal + value
  }

  
};

const Form = {

  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields() {
    const { description, amount, date} = Form.getValues()

    if( description.trim() === "" || 
        amount.trim() === "" || 
        date.trim() === "") {
          throw new Error("Por favor, preencha todos os Campos")
    }
  },

  formatValues() {
    let { description, amount, date} = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  clearFields() {
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },

  submit(event) {
    event.preventDefault()

    try {
      Form.validateFields()
      const transaction = Form.formatValues()
      Transaction.add(transaction)
      Form.clearFields()
      Modal.close()

    } catch (error) {
      alert(error.message)
    }
    
    Form.validateFields()

    Form.formatValues()
    // Abaixo está o passo a passo da função submit
    //verificar se todas as informaçoes foram preenchidas
    //depois formata os dados para salva
    //depois salvar de fato os dados
    // após isso apagar os dados do formulario
    // depois fechar o modal
    // e Atualiza á aplicação
  }
};

const App = {
  init() {

    Transaction.all.forEach(DOM.addTransaction)

    DOM.updateBalance();
    Storage.set(Transaction.all)

  },

  reload() {
    DOM.clearTransactions()
    App.init()
  }
};


App.init();



