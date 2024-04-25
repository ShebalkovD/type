let heading = document.querySelector('.text');

let text = 'вода кот печать слепой скрипт'.split("");
let screen_text = []

for (let index = 0; index < text.length; index++) {
    const element = `<span>${text[index]}</span>`;
    screen_text.push(element)
}

let i = 0;
let number = text[i];

heading.innerHTML = screen_text.join('')
heading.style.color = 'gray'

let children = heading.children;


function trackKeyboardActivity() {
    document.addEventListener('keydown', function(event) {
        console.log('ЦЕЛЬ!' + number)

        // Get the key that was prыessed
        const keyPressed = event.key;
        // Get the code of the key that was pressed
        const keyCode = event.code;
        console.log('Key pressed: ' + keyPressed);
        console.log('Key code: ' + keyCode);
        if (number == keyPressed) {
            children[i].style.color = 'black'
            i = i + 1
            number = text[i]

        } else {

            children[i].style.color = 'red'
            console.log('ERROR!' + number)
        }
        // Here you can replace console.log with your analytics tracking code
    });
}


trackKeyboardActivity('.printed');








