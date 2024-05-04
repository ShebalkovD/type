let heading = document.querySelector('.text') // тег, который отображает текст
let btn = document.querySelector('button') 

let text = 'вода кот печать слепой скрипт'.split("") // массив с символами для перебора и проверки
let screen_text = [] // массив для вывода на экран

// наполнение массива символами, обернутыми в span
for (let index = 0; index < text.length; index++) {
    const element = `<span>${text[index]}</span>`
    screen_text.push(element)
}

let i = 0 // счетчик символов
var number = text[i] // текущий символ

heading.innerHTML = screen_text.join('') // сборка строки и вывод на экран
heading.style.color = 'gray'

let children = heading.children // получение массива символов, обернутых в span
children[0].classList.add('current') // добавление каретки для символа

function reset(){
    i = 0 // счетчик символов
    number = text[i] // текущий символ
    heading.style.color = 'gray'
    for (let index = 0; index < children.length; index++) {
        const element = children[index];
        element.classList.remove('current')
        element.style.color = 'gray'
        
    }

    children[0].classList.add('current') // добавление каретки для символа
}
    

btn.addEventListener('click', function(){
    reset()
})

function trackKeyboardActivity() {
    document.addEventListener('keydown', function(event) {
        console.log('ЦЕЛЬ!' + number)

        // получение нажатой клавиши
        const keyPressed = event.key
        // получение ее кода
        const keyCode = event.code
        console.log('Key pressed: ' + keyPressed)
        console.log('Key code: ' + keyCode)

        // проверка на совпадение нажатой клавиши и текущего символа
        if (number == keyPressed) {
            children[i].style.color = 'white'
            i = i + 1 // переход к следующему символу
            number = text[i]
            children[i-1].classList.remove('current') // удаление каретки для предыдущего символа
            children[i].classList.add('current') // добавление каретки для следующего символа
            

        } else {

            children[i].style.color = 'red'
            console.log('ERROR!' + number)
        }
        
    });
}


trackKeyboardActivity()








