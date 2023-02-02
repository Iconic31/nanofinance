// Get UI
const balance = document.getElementById('balance');
const debit = document.getElementById('debit');
const credit = document.getElementById('credit');

const openBtn = document.getElementById('open-btn');
const getBtn  = document.getElementById('btn');
const getForm = document.getElementById('form');
const getTranStatus = document.querySelectorAll('.form-check-input');
const getAmount = document.getElementById('amount');
const getDate = document.getElementById('date');
const getRemark = document.getElementById('remark');

const getHistoryBox = document.querySelector('.history-box');
const getUl = document.getElementById('list-group');

openBtn.addEventListener('click',function(){
    getHistoryBox.classList.toggle('show');
}); 


const dummyDatas = [
    {
        id : 1,
        transtatus : '+',
        remark : 'Petty Cash',
        amount : 1000,
        date : '2023-01-20'
    },
    {
        id : 2,
        transtatus : "-",
        remark : 'Pen',
        amount : -20,
        date : '2023-01-21'
    },
    {
        id : 3,
        transtatus : "+",
        remark : 'Other Income',
        amount : 300,
        date : '2023-01-20'
    },
    {
        id : 4,
        transtatus : "-",
        remark : 'Book',
        amount : -10,
        date : '2023-01-20'
    },
    {
        id : 5,
        transtatus : "-",
        remark : 'Water',
        amount : -150,
        date : '2023-01-20'
    },
    {
        id : 6,
        transtatus : "-",
        remark : 'Tea',
        amount : -100,
        date : '2023-01-20'
    }
];


// for local storage
const localStorageDatas = JSON.parse(localStorage.getItem('transactions'));
let getHistories = localStorage.getItem('transactions') !== null ? localStorageDatas : [];


init();
// initial App
function init(){
    getUl.innerHTML = "";

    // dummyDatas.forEach(addToUl);

    getHistories.forEach(addToUl);    

    totalValue();
}

// add to ui
function addToUl(transactionData){
    const newLi = document.createElement('li');

    newLi.innerHTML = `
        ${transactionData.remark} <span>${transactionData.transtatus}${Math.abs(transactionData.amount)}</span><span>${transactionData.date}</span> 
        <button type="button" class="deleteBtn" onclick="removeTransation(${transactionData.id})">&times;</button>
    `;
    
    newLi.className  = 'list-group-item';

    newLi.classList.add(transactionData.transtatus === '-' ? 'crd' : 'deb');

    getUl.append(newLi);
}

// for sign
let sign = '-';
getTranStatus.forEach(function(tranStatus){
    tranStatus.addEventListener('change',function(){
        if(this.value === 'debit'){
            sign = "+";
        }else if(this.value === 'credit'){
            sign = "-";
        }
    });
});


function newTransaction(e){
    
    if(isNaN(getAmount.value) || getAmount.value.trim() === "" || getDate.value.trim() === "" || getRemark.value.trim() === ""){
        alert('Ohh!!!... Some data are missing');
    }else{

        const transaction = {
            id : generateIdx(),
            transtatus : sign,
            amount : sign === "-" ? Number(-getAmount.value) : Number(getAmount.value),
            date : getDate.value,
            remark : getRemark.value
        };
        

        getHistories.push(transaction);

        addToUl(transaction);

        updateLS();

        totalValue();

        getAmount.value = "";
        getDate.value = "";
        getRemark.value = "";

        getAmount.focus();
    }

    e.preventDefault();
}

// update Local Storage
function updateLS(){
    localStorage.setItem('transactions',JSON.stringify(getHistories));
}

// generate idx
function generateIdx(){
    return Math.floor(Math.random()  * 1000);
}

// delete transation
function removeTransation(tranid){
    getHistories = getHistories.filter((history) => history.id !== tranid);

    init();
    updateLS();
}

// to get total value , debit , credit
function totalValue(){
    const amounts = getHistories.map(history => history.amount);

    const balanceAmount = amounts.reduce((total,currVal) => total += currVal, 0).toFixed(2);
    const debitAmount = amounts.filter(amount=> amount > 0).reduce((total,currVal) => total += currVal,0).toFixed(2);
    const creditAmount = amounts.filter(amount => amount < 0).reduce((total,currVal) => total += currVal,0).toFixed(2);

    balance.innerHTML = balanceAmount;
    debit.innerHTML = debitAmount;
    credit.innerHTML = creditAmount;
}

totalValue();


getForm.addEventListener('submit',newTransaction);
