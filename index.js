"use strict";

//Testing for interaction with the JS file
console.log("JS file loaded!");

//Currency Tabs
const currencyTabs = document.querySelectorAll(".currency-tab")
let api = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

//Variables for the tip calculator
const inputEl = document.querySelector("#input");
const btnEl = document.querySelectorAll(".btn");
const customTip = document.querySelector("#customTip");
const errorEl = document.querySelector("#error");
const peopleEl = document.querySelector("#people");
const totalVal = document.querySelectorAll(".tipAmount");
const resetEl = document.querySelector(".reset");

let currencySymbol = "$"; 
let exchangeRates = {};
let activeCurrency = "USD"; 
let billVal = 0;
let peopleVal = 1;
let tipVal = 0.15;

inputEl.addEventListener("input", validateBill);
peopleEl.addEventListener("input", setPeople);
customTip.addEventListener("input", tipCustomVal);
resetEl.addEventListener("click", handleReset);


//Event listener for currency tabs
currencyTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        currencyTabs.forEach(t => t.classList.remove("active"));

        tab.classList.add("active");

        //Update the activecurrency and currency symbol
        activeCurrency = tab.dataset.currency;
        currencySymbol = getSymbol(activeCurrency);
        calculate();

    });
});

//Event listener for button
btnEl.forEach((btn) => {
    btn.addEventListener("click", handleClick);
});

//Function to handle button click
function handleClick(e) {
    btnEl.forEach((btn) => {
        btn.classList.remove("active");

        if(e.target.innerHTML === btn.innerHTML) {
            btn.classList.add("active")
            tipVal = parseFloat(btn.innerHTML) / 100;
            //console.log(tipVal)   
        }
    });

    customTip.value = "";
    calculate();
}

//Bill Value Input Validation
function validateBill(){
    if (inputEl.value.includes(",")) {
        inputEl.value = inputEl.value.replace(",", ".");
    }
    billVal = parseFloat(inputEl.value);
    calculate();
}

//Custom Tip function
function tipCustomVal(){
    tipVal = parseFloat(customTip.value) / 100 || 0;

    btnEl.forEach((btn) => {
        btn.classList.remove("active");
    });

    if (customTip.value !== 0){
        calculate();
    }
}

//Set the number of people
function setPeople() {
    peopleVal = parseFloat(peopleEl.value);

    if (peopleVal < 1) {
        errorEl.innerHTML = "number of people cannot be less than 1";

        setTimeout(() => {
            errorEl.innerHTML = "";
        }, 2000);
    }
    calculate();
}

async function fetchExchangeRates() {
    try {
        const response = await fetch(api);
        const data = await response.json();

        if (data.result === "success") {
            exchangeRates = data.conversion_rates;
            console.log("Exchange rates successfully loaded:", exchangeRates);
        }else{
            console.error("Failed to load exchange rates:", data);
        }
    } catch (error){ 
        console.error("Fetch failed:", error);
    }
}

fetchExchangeRates();

function switchCurrency(currency) {
    if (!exchangeRates[currency]) return;


    let tipInUSD = (billVal * tipVal) / peopleVal;
    let totalInUSD = (billVal * (tipVal + 1)) / peopleVal;

    let tipConverted = tipInUSD * exchangeRates[currency];
    let totalConverted = totalInUSD * exchangeRates[currency];

    totalVal[0].innerHTML = getSymbol(currency) + tipConverted.toFixed(2);
    totalVal[1].innerHTML = getSymbol(currency) + totalConverted.toFixed(2);
}


function getSymbol(curr) {
    switch (curr) {
        case "USD": return "$";
        case "EUR": return "€";
        case "GBP": return "£";
        case "JPY": return "¥";
        default: return "";
    }
}


//Calulate function
function calculate() {
    if (peopleVal >= 1) {
        let tip = (billVal * tipVal) / peopleVal;
        let totalAmount = (billVal * (tipVal + 1)) / peopleVal;
        
        //If tab isnt USD this converts the values
        if (activeCurrency !== "USD" && exchangeRates[activeCurrency]) {
            tip *= exchangeRates[activeCurrency];
            totalAmount *= exchangeRates[activeCurrency];
        }

        totalVal[0].innerHTML = getSymbol(activeCurrency) + tip.toFixed(2);
        totalVal[1].innerHTML = getSymbol(activeCurrency) + totalAmount.toFixed(2);
        //console.log(totalVal);
    }
}


//Reset function
function handleReset() {
    //Reset Sections

    //Input Values
    inputEl.value = 0.0;
    validateBill();

    //Tip Buttons
    btnEl.forEach(btn => btn.classList.remove("active"));
    btnEl[2].click();

    //People
    peopleEl.value = 1;
    setPeople();

    //Reset tab and currency to USD
    currencyTabs.forEach(tab => tab.classList.remove("active"));
    const usdTab = document.querySelector('.currency-tab[data-currency="USD"]');
    if (usdTab) {
        usdTab.classList.add("active");
        switchCurrency("USD");
        currencySymbol = "$"; 
        activeCurrency = "USD";
    }
    //Updates Display 
    calculate();
}