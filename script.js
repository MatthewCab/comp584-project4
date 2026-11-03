var screen = document.getElementById("screen");
var buttons = document.querySelectorAll(".calculator-buttons button");

buttons.forEach(function(button) {
    button.addEventListener("click", function() {
        var value = button.dataset.value;

        // to remove all display contents (clear)
        if (value == "C"){
            screen.textContent = "0";
        }
        // to delete one character (delete)
        else if (value == "backspace") {
            screen.textContent = screen.textContent.slice(0,-1);

            // so screen isn't blank display 0 if there are no more characters
            if (screen.textContent == ""){
                screen.textContent = "0";
            }
        }
        // to calculate equations when equal is pressed
        else if (value == "equals"){

        }
        else {
            // if default screen replace default "0" character with character user pressed
            if (screen.textContent == "0"){
                screen.textContent = value;
            }
            // if not on default screen then display character pressed with other characters on screen
            else {
                screen.textContent += value;
            }
        }
    });
});


