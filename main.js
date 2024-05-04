let heading = document.querySelector('.text') // тег, который отображает текст
let btn = document.querySelector('button')
let text_arr = ['вода кот печать слепой скрипт', 'вторая строка для печати в тренажере','вода кот печать слепой скрипт',] 

let text_counter = 0
let text = ['t','e','x','t'] // массив с символами для перебора и проверки
let screen_text = []// массив для вывода на экран


let children // получение массива символов, обернутых в span
let i = 0 // счетчик символов


function fill_text(i){
    text = text_arr[i].split("") // массив с символами для перебора и проверки
    screen_text = [] 
    // наполнение массива символами, обернутыми в span
    for (let index = 0; index < text.length; index++) {
        const element = `<span>${text[index]}</span>`
        screen_text.push(element)
    }
    heading.innerHTML = screen_text.join('') // сборка строки и вывод на экран
    heading.style.color = 'gray'
    
    children = heading.children
    children[0].classList.add('current')
    reset()
}

fill_text(text_counter)

var number = text[i] // текущий символ



children[0].classList.add('current') // добавление каретки для символа

function reset(){
    i = 0 // счетчик символов
    number = text[i] // текущий символ
    heading.style.color = 'gray'
    for (let index = 0; index < children.length; index++) {
        const element = children[index];
        element.classList.remove('current')        
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
            if (i == text.length-1){
                text_counter ++
                fill_text(text_counter)
            }else{
                children[i].style.color = 'white'
                i = i + 1 // переход к следующему символу
                number = text[i]
                children[i-1].classList.remove('current') // удаление каретки для предыдущего символа
                children[i].classList.add('current') // добавление каретки для следующего символа
                
            }
            
            
        } else {

            children[i].style.color = 'red'
            console.log('ERROR!' + number)
        }
        
    });
}


trackKeyboardActivity()








