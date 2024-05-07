let heading = document.querySelector('.text')  // тег, который отображает текст
let stats = document.getElementById('stats')   // тег, который отображаем статистику
let timer = document.getElementById('timer')   // тег, который отображаем статистику

let text_counter = 0 // счетчик фраз в списке
let text = [] // массив с символами для перебора и проверки
let screen_text = []// массив для вывода на экран
let children // массив символов, обернутых в span
let i = 0 // счетчик символов 
let number = text[i] // текущий символ
let text_arr = ['--- здесь должен быть текст ---'] // фразы для вывода на экран

let sign_counter = 0 // счетчик символов для статистики
let time = 30 // время таймера

// обрабатывает текст для печати и выводит на экран
function fill_text(i) {
    text = text_arr[i].split("")
    screen_text = [] 

    // наполнение массива символами, обернутыми в span
    for (let index = 0; index < text.length; index++) {
        const element = `<span>${text[index]}</span>`
        screen_text.push(element)
    }

    heading.innerHTML = screen_text.join('') // сборка строки и вывод на экран
    children = heading.children // получение символов текущей строки
    children[0].classList.add('current') // добавление каретки первому символу
    
    reset()
}

// сброс прогресса текущей строки
function reset(){
    i = 0 // счетчик символов
    number = text[i] // текущий символ

    heading.style.color = 'gray'

    for (let index = 0; index < children.length; index++) {
        const element = children[index];
        element.classList.remove('current') // сброс каретки
        element.style.color = 'gray' // сброс цвета
    }

    children[0].classList.add('current') // добавление каретки для символа
}

// полный сброс прогресса (заново)
function full_reset(){
    sign_counter = 0
    text_counter = 0
    
    fill_text(text_counter)
    set_stats()
    clearInterval(tick)
    clearTimeout(timer_id)
    // console.log('Таймер СТОП');
    start_timer()
}  

// вывод статистики на экран
function set_stats() {
    spm = Math.round(sign_counter / 60)
    stats.innerHTML = `Символов в минуту: ${spm}`

    // console.log('Кол-во символов:', sign_counter);
    // console.log('Символов в минуту:', spm);
}

function start_timer() {
    timer_value = time
    timer.innerHTML = `Время: ${timer_value}`
    // console.log('Таймер СТАРТ');
    tick = setInterval(function() {
        timer_value --
        timer.innerHTML = `Время: ${timer_value}`
    }, 1000)

    timer_id = setTimeout(function() {
        // console.log('Таймер СТОП');
        clearInterval(tick)
        set_stats()
    }, time * 1000)

    return tick
}

// основная функция для обработки нажатий клавиш
function trackKeyboardActivity() {
    document.addEventListener('keydown', function(event) {
        const keyPressed = event.key // получение нажатой клавиши
        const keyCode = event.code // получение ее кода

        // Вывод в консоль целевого символа и нажатой клавиши, ее кода
        // console.log('ЦЕЛЬ!' + number)  
        // console.log('Key pressed: ' + keyPressed)
        // console.log('Key code: ' + keyCode)

        // если нажата верная клавиша
        if (number == keyPressed) {
            sign_counter ++

            // если символ последний в строке - переходим к новой
            if (i == text.length-1 && text_counter != text_arr.length - 1) {
                text_counter ++
                fill_text(text_counter)
            }
            // если не последний
            else {
                children[i].style.color = 'white'

                // переход к следующему символу
                i = i + 1 
                number = text[i]

                children[i-1].classList.remove('current') // удаление каретки для предыдущего символа
                children[i].classList.add('current') // добавление каретки для следующего символа
            }

            if (i == text.length-1 && text_counter == text_arr.length - 1) {
                set_stats()
            }
        }
        // если нажата неверная клавиша 
        else {
            // сброс тренажера при нажатии сочетания клавиш (Ctrl + Enter)
            if (keyCode === 'Enter' && (event.ctrlKey || event.metaKey)){
                full_reset()
            }
            else {
                // вывод ошибки на экран
                children[i].style.color = 'red'
                console.log('ERROR!' + number)
            }
        }
    })
}

// Фразы для вывода на экран
text_arr = [
'первая строка',
'вторая строка',
'третья строка',
] 

fill_text(text_counter) // обработка текста и вывод на экран
trackKeyboardActivity() // запуск отслеживания нажатия клавиш

// таймер 

var tick = start_timer()







