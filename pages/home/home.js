function logout() {
  firebase.auth().signOut().then(() => {
      window.location.href = "../../index.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}

firebase.auth().onAuthStateChanged(user => {
  if (user){
      findTransactions(user);
  }
})

function newTransaction() {
  window.location.href = "../transaction/transaction.html";
}

function findTransactions(user) {
  showLoading();
  transactionService.findByUser(user)
      .then(transactions => {
          hideLoading();
          addTransactionsToScreen(transactions);
      })
      .catch(error => {
          hideLoading();
          console.log(error);
          alert('Erro ao recuperar transacoes');
      })
}

function addTransactionsToScreen(transactions) {
  const orderedList = document.getElementById('transactions');

  transactions.forEach(transaction => {
      const li = createTransactionListItem(transaction);
      li.appendChild(createDeleteButton(transaction));

      li.appendChild(createParagraph(formatDate(transaction.date)));
      li.appendChild(createParagraph(formatMoney(transaction.money)));
      li.appendChild(createParagraph(transaction.type));
      if (transaction.description) {
          li.appendChild(createParagraph(transaction.description));
      }

      orderedList.appendChild(li);
  });
}

function createTransactionListItem(transaction) {
  const li = document.createElement('li');
  li.classList.add(transaction.type);
  li.id = transaction.uid;
  li.addEventListener('click', () => {
      window.location.href = "../transaction/transaction.html?uid=" + transaction.uid;
  })
  return li;
}

function createDeleteButton(transaction) {
  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = "Remover";
  deleteButton.classList.add('outline', 'danger');
  deleteButton.addEventListener('click', event => {
      event.stopPropagation();
      askRemoveTransaction(transaction);
  })
  return deleteButton;
}

function createParagraph(value) {
  const element = document.createElement('p');
  element.innerHTML = value;
  return element;
}

function askRemoveTransaction(transaction) {
  const shouldRemove = confirm('Deseja remover a transaçao?');
  if (shouldRemove) {
      removeTransaction(transaction);
  }
}

function removeTransaction(transaction) {
  showLoading();

  transactionService.remove(transaction)
      .then(() => {
          hideLoading();
          document.getElementById(transaction.uid).remove();
      })
      .catch(error => {
          hideLoading();
          console.log(error);
          alert('Erro ao remover transaçao');
      })
}

function addDayToDate(dateString) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date;
}
//addDayToDate(dateString) é uma gambiarra para resolver o problema de fusorario.
function formatDate(date) {
  const formattedDate = addDayToDate(date).toLocaleDateString("pt-br");
  return formattedDate;
}
// function formatDate(date) {
//   return new Date(date).toLocaleDateString("pt-br");
// } fiz uma gambiarra pra resolver o problema de fusorário

// Substitua a função formatMoney existente pela nova função formatMoney
function formatMoney(money) {
  if (typeof money.value === "number") {
    return `${money.currency} ${money.value.toFixed(2)}`;
  } else {
    return `${money.currency} Valor Inválido`;
  }
}
// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if false;
//     }
//   }
// }
//codigo da versao original
// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {

//     // This rule allows anyone with your Firestore database reference to view, edit,
//     // and delete all data in your Firestore database. It is useful for getting
//     // started, but it is configured to expire after 30 days because it
//     // leaves your app open to attackers. At that time, all client
//     // requests to your Firestore database will be denied.
//     //
//     // Make sure to write security rules for your app before that time, or else
//     // all client requests to your Firestore database will be denied until you Update
//     // your rules
//     match /{document=**} {
//       allow read, write: if request.time < timestamp.date(2023, 7, 12);
//     }
//   }
// }
