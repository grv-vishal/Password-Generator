const passwordDisplay=document.querySelector(".display");
const copyBtn=document.querySelector(".copybtn");
const copyMsg=document.querySelector(".copymsg");

const inputSlider=document.querySelector(".slider");
const lengthDisplay=document.querySelector(".length");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const Indicator=document.querySelector(".indicator");
const generatePass=document.querySelector(".generatepass");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");

const symbols='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordlength=8;
let checkCount=0;

Sliderhandle();
SetIndicator("#ccc");

function Sliderhandle(){
    inputSlider.value=passwordlength;
    lengthDisplay.innerText=passwordlength;

    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordlength-min)*100/(max-min))+"% 100%";
}

function SetIndicator(color){
    Indicator.style.backgroundColor=color;
    Indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


function getRndInt(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRndNum() {
    return getRndInt(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInt(97,123));
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInt(65,91));
}

function generateSymbols(){
    const rndNum = getRndInt(0, symbols.length);
    return symbols.charAt(rndNum);
}

function CalStrength(){
    let Upper=false;
    let Lower=false;
    let Number=false;
    let Symbol=false;

    if(uppercaseCheck.checked) Upper=true;
    if(lowercaseCheck.checked) Lower=true;
    if(numbersCheck.checked) Number=true;
    if(symbolsCheck.checked) Symbol=true;

    if(Upper && Lower && (Number || Symbol) && passwordlength>=8){
        SetIndicator("#0f0");
    }
    else if((Upper || Lower) && (Number || Symbol) && passwordlength>=6){
        SetIndicator("#ff0");
    }
    else{
        SetIndicator("#f00"); 
    }
}

inputSlider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    Sliderhandle();
})

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }

    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

copyBtn.addEventListener('click', () => {
    console.log("copymsg");
    if(passwordDisplay.value)
        copyContent();
})

function handleCheckBox(){
    checkCount=0;
    allCheckBox.forEach((check) => {
        if(check.checked)
           checkCount++;
    });

    if(passwordlength < checkCount){
        passwordlength=checkCount;
        Sliderhandle();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBox);
});


generatePass.addEventListener('click',() => {

    if(checkCount==0)
       return;

    if(passwordlength < checkCount){
        passwordlength=checkCount;
        Sliderhandle();
    }  
    
    password="";

    //created a function array to store all types of function that is checked
    let funArr=[];

    if(uppercaseCheck.checked)
        funArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funArr.push(generateRndNum);

    if(symbolsCheck.checked)
        funArr.push(generateSymbols);

    for(let i=0;i<funArr.length;i++){
        password+=funArr[i]();
    }  
    for(let i=0; i<passwordlength-funArr.length; i++) {
        let randIndex = getRndInt(0 , funArr.length);
        password += funArr[randIndex]();
    }
    password=ShufflePassword(Array.from(password));
    passwordDisplay.value=password;
    CalStrength();  
})

function ShufflePassword(array){
    for(let i=array.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    let str="";
    array.forEach((element) =>(str+=element));
    return str;
}

