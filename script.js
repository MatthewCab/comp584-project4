var screen = document.getElementById("screen");
var buttons = document.querySelectorAll(".calculator-buttons button");

// this is to store all values pressed on the calculator and will allow for 
// multiple number calculations. Will also let us prioritize multiplication
// and division over addition and subtraction
var calculation = [];
var justCalculated = false;

function isOperator(value){
    return ["add","subtract","multiply","divide"].includes(value);
}; // end isOperator function

function updateScreen() {
    // assigning html characters to operators
    var symbols = {
        add: "&plus;",
        subtract: "&minus;",
        multiply: "&#10799;",
        divide: "&divide;"
    };

    // use innerHTML and map in order to display and interpret special character values from html
    screen.innerHTML = calculation.map(function(value){
        return symbols[value] || value;
    }).join(" ");
}; // end updateScreen function

function calculate() {
    var arrayCopy = calculation.slice();

    // if array is empty or last value is an operator do nothing and return
    if (arrayCopy.length == 0 || isOperator(arrayCopy[arrayCopy.length - 1])) {
        return;
    }

    // prioritize multiplication and division first
    for(var i = 0; i < arrayCopy.length; i++){
        if(arrayCopy[i] === "multiply" || arrayCopy[i] === "divide"){
            // since arrayCopy[i] is the operator in this instance we want
            // the numbers before and after the operator for calculations
            var first = Number(arrayCopy[i - 1]);
            var second = Number(arrayCopy[i + 1]);
            var result;

            if(arrayCopy[i] === "multiply"){
                result = first * second;
            }
            else{
                result = first / second;
            }

            // this is more for division, if you try to divide by zero
            // it's not possible so display an error message
            if(!Number.isFinite(result)){
                screen.textContent = "Error";
                calculation = [];
                justCalculated = true;
                return;
            }

            // remove the 2 values and operator that were just used in the calculation
            // and replaces them with the calculated value.
            // i-- moves index back since array shrinks after calculations
            arrayCopy.splice(i - 1, 3, String(result));
            i--;
        }
    }

    // final value IF only calculating multiplication and division
    // if equation also has addition and subtraction we're just setting the
    // first value in the array to final result and from there it will process 
    // all addition and subtraction in display order
    var finalResult = Number(arrayCopy[0]);

    // addition and subtraction is prioritized last
    // starts at 1 and increases by 2 to solely see operators
    for(var i = 1; i < arrayCopy.length; i+=2){
        var operator = arrayCopy[i];
        var number = Number(arrayCopy[i+1]);

        if(operator === "add"){
            finalResult += number;
        }
        else if (operator === "subtract"){
            finalResult -= number;
        }
    }

    // error check for giant numbers
    if(!Number.isFinite(finalResult)){
        screen.textContent = "Error";
        calculation = [];
    }
    else{
        calculation = [String(finalResult)];
        screen.textContent = String(finalResult);
    };
    justCalculated = true;
}; // end calculation function

buttons.forEach(function(button) {
    button.addEventListener("click", function() {
        var value = button.dataset.value;

        // to remove all display contents (clear)
        if (value === "C"){
            calculation = [];
            screen.textContent = "0";
            justCalculated = false;
        } // "clear"
        // to delete one character (delete)
        else if (value === "backspace") {
            // resets justCalculated in order to start a new calculation
            if(justCalculated){
                justCalculated = false;
            }
            // if array contains more than 0 items
            if(calculation.length > 0){
                var lastValue = calculation.length - 1;

                // remove operator and index if thats the last item
                if(isOperator(calculation[lastValue])){
                    calculation.pop();
                }
                // removes number value from multi-digit values and removes entire array index
                // if only a single digit
                else{
                    calculation[lastValue] = calculation[lastValue].slice(0,-1)
                    if(calculation[lastValue] === ""){
                        calculation.pop();
                    }
                }
            }
            updateScreen();
        } // "backspace"

        // Equals button is pressed so calculate equation
        // using calculate() method
        else if (value === "equals") {
            if (!justCalculated) {
                calculate();
            }
        } // "equals"

        else if (isOperator(value)) {
            // reset justCalculated boolean for new calculation
            if (justCalculated) {
                justCalculated = false;
            }

            // prevents you from starting equation with an operator
            if (calculation.length > 0) {

                var lastValue = calculation.length - 1;

                // if last value is an operator, this replaces that operator
                // with the new one pressed so the calculator doesnt have 
                // multiple operators side by side
                if (isOperator(calculation[lastValue])) {
                    calculation[lastValue] = value;
                }
                // if last value is a number this just adds the operator
                // to the end of array
                else {
                    calculation.push(value);
                }

                updateScreen();
            }
        } // "clicking/adding operators"

        // Number buttons
        else {

            // resets array and removes the previously calculated value
            // if you did "5 x 5" youd get "25" but after the calculation if
            // you press another number the 25 would get replaced
            if (justCalculated) {
                calculation = [];
                justCalculated = false;
            }

            var lastValue = calculation.length - 1;

            // adds number to beginning of array if empty or end of array if the current
            // last item in the array is an operator
            if (calculation.length === 0 || isOperator(calculation[lastValue])) {
                calculation.push(value);
            }
            // replaces single 0's so "4 + 0" would become "4 + 5" if 5 is clicked
            else if (calculation[lastValue] === "0") {

                calculation[lastValue] = value;
            }
            // attachs number to another number if last item is a number
            // so if last number is "4" it would become "45" after clicking 5
            else {
                calculation[lastValue] += value;
            }

            updateScreen();
        } // pressing numbers

    });
});


