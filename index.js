"use strict";
//Testing for interaction with the JS file
console.log("JS file loaded!");

//Variables for the tip calculator
const inputEl = document.querySelector("#input");
const btnEl = document.querySelectorAll(".btn");
const customTip = document.querySelector("#customTip");
const errorEl = document.querySelector("#error");
const peopleEl = document.querySelector("#people");
const totalVal = document.querySelectorAll(".tipAmount");
const resetEl = document.querySelector(".reset");

let billVal = 0;
let peopleVal = 1;
let tipVal = 0.15;

inputEl.addEventListener("input", validateBill);
peopleEl.addEventListener("input", setPeople);
customTip.addEventListener("input", tipCustomVal);
resetEl.addEventListener("click", handleReset);

//Event for button
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
        inputEl.value.replace(",", ".");
    }
    billVal = parseFloat(inputEl.value);
    calculate();
}

//Custom Tip function
function tipCustomVal(){
    tipVal = parseFloat(customTip.value / 100);

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


//Calulate function
function calculate() {
    if (peopleVal >= 1) {
        let tip = (billVal * tipVal) / peopleVal;
        let totalAmount = (billVal * (tipVal + 1)) / peopleVal;
        
        totalVal[0].innerHTML = "$" + tip.toFixed(2);
        totalVal[1].innerHTML = "$" + totalAmount.toFixed(2);
        //console.log(totalVal);
    }
}


//Reset function
function handleReset() {
    inputEl.value = 0.0;
    validateBill();
    btnEl[2].click();
    peopleEl.value = 1;
    setPeople();
}