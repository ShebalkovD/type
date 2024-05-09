let heading = document.querySelector('.text') // тег, который отображает текст
let stats = document.querySelector('.stats') // тег, который отображает статистику
let stats_speed = document.getElementById('speed') // тег, который отображает скорость
let stats_mistakes = document.getElementById('mistakes') // тег, который отображает кол-во ошибок
let stats_accuracy = document.getElementById('accuracy') // тег, который отображает точность
let stats_img = document.querySelector('.stats_img') // картинка в статистике
let restart_btn = document.querySelector('.restart') // кнопка заново
let timer = document.getElementById('timer') // тег, который отображает время
let type_cat = document.querySelector('.type_cat') // картинка кота над текстом

let type_cat_state = false // состояние анимации кота
let isStart = true // состояние тренажера (вкл/выкл отслеживания события нажатия на клавишу)

let text = [] // массив с символами для перебора и проверки
let screen_text = [] // массив для вывода на экран
let children // массив символов, обернутых в span
let i = 0 // счетчик символов 
let number // текущий символ
let text_shift = 0 // смещение текста
let text_arr = ['--- здесь должен быть текст ---'] // исходный текст

let sign_counter = 0 // счетчик символов для статистики
let mistakes = 0 // счетчик ошибок
let time = 60 // время таймера

// обработка текста и вывод на экран
function fill_text() {
    text = text_arr[0].split("")
    screen_text = [] 
    number = text[i]

    // наполнение массива символами, обернутыми в span
    for (let index = 0; index < text.length; index++) {
        const element = `<span>${text[index]}</span>`
        screen_text.push(element)
    }

    heading.innerHTML = screen_text.join('') // сборка строки и вывод на экран
    heading.style.color = 'gray'
    children = heading.children // получение символов текущей строки
    children[0].classList.add('current') // добавление каретки первому символу
}

// разрешение запуска обработки нажатий, запуск таймера
function start(){
    isStart = true
    start_timer()
}

// полный сброс прогресса (заново)
function reset(){
    set_stats()
    isStart = false
    text_arr = mix(text_arr) // Перемещивание текста
    i = 0
    sign_counter = 0
    mistakes = 0
    text_shift = 0

    heading.style.transform = `translateX(calc(20%))` // сдвиг сроки
    heading.style.color = 'gray'
    
    fill_text()
    clearInterval(tick)
    clearTimeout(timer_id)
    // console.log('Таймер СТОП');
}  

// вывод статистики на экран
function set_stats() {
    spm = Math.round(sign_counter/5) // расчет скорости в wpm (слова в минуту)

    stats.style.display = 'flex' // открытие окна статистики
    stats_speed.innerHTML = `${spm} слов в минуту (WPM)`
    stats_mistakes.innerHTML = mistakes

    // смена картинки зависит от скорости печати
    if (spm <= 40) {
        stats_img.setAttribute('src', 'src/gif20-40.gif')
    } else if (spm > 40 && spm <= 50) {
        stats_img.setAttribute('src', 'src/gif40-50.gif')
    } else if (spm > 50 && spm <= 60) {
        stats_img.setAttribute('src', 'src/gif50-60.gif')
    } else if (spm > 60 && spm <= 80) {
        stats_img.setAttribute('src', 'src/gif60-80.gif')
    } else if (spm > 80 && spm <= 100) {
        stats_img.setAttribute('src', 'src/gif80-100.gif')
    } else if (spm > 100) {
        stats_img.setAttribute('src', 'src/gif100+.gif')
    }

    // если не было введено ни одного символа, вместо точности выводится "неопределена"
    if (sign_counter > 0) {
        accuracy = ((sign_counter*100)/(sign_counter+mistakes)).toFixed(2)
    } else {
        accuracy = 'неопределена'
    }

    // смена цвета точности зависит от самой точности
    if (accuracy < 80) {
        stats_accuracy.style.color = 'red'
    } else {
        stats_accuracy.style.color = 'green'
    }
    
    stats_accuracy.innerHTML = `${accuracy}%`

    console.log('Кол-во символов:', sign_counter);
    console.log('Символов в минуту:', spm);
}

// запуск таймера
function start_timer() {
    timer_value = time
    timer.innerHTML = timer_value
    // console.log('Таймер СТАРТ');
    tick = setInterval(function() {
        timer_value --
        timer.innerHTML = timer_value
    }, 1000)

    timer_id = setTimeout(function() {
        // console.log('Таймер СТОП');
        clearInterval(tick)
        reset()
    }, time * 1000)

    return tick
}   

// основная функция для обработки нажатий клавиш
function trackKeyboardActivity() {
    document.addEventListener('keydown', function(event) {
        if (isStart === true) {
            const keyPressed = event.key // получение нажатой клавиши
            const keyCode = event.code // получение ее кода

            // Вывод в консоль целевого символа и нажатой клавиши, ее кода
            // console.log('ЦЕЛЬ!' + number)  
            // console.log('Key pressed: ' + keyPressed)
            // console.log('Key code: ' + keyCode)

            // если нажата верная клавиша
            if (number == keyPressed) {
                // смена картинки кота
                if (type_cat_state === false) {
                    type_cat.setAttribute('src', 'src/cat-left.png')
                    type_cat_state = true
                } else {
                    type_cat.setAttribute('src', 'src/cat-right.png')
                    type_cat_state = false
                }

                sign_counter ++ // подсчет верных символов

                children[i].style.color = 'white'
                text_shift += children[i].offsetWidth + 0.41
                heading.style.transform = `translateX(calc(20% - ${text_shift}px))` // сдвиг сроки

                // console.log('символ',children[i]);
                // console.log('ширина',children[i].offsetWidth);
                // console.log('смещение',text_shift);

                // переход к следующему символу
                i = i + 1 
                number = text[i]

                children[i-1].classList.remove('current') // удаление каретки для предыдущего символа
                children[i].classList.add('current') // добавление каретки для следующего символа

                // Если символ последний выводим статистику
                if (i == text.length-1) {
                    set_stats()
                }
            }
            // если нажата неверная клавиша 
            else {
                type_cat.setAttribute('src', 'src/cat-still.png') // смена картинки кота

                // сброс тренажера при нажатии сочетания клавиш (Ctrl + Enter)
                if (keyCode === 'Enter' && (event.ctrlKey || event.metaKey)){
                    reset()
                }
                else {
                    mistakes++
                    // вывод ошибки на экран
                    children[i].style.color = 'red'
                    console.log('ERROR!' + number)
                }
            }
        }
        
    })
}

// Перемещивание текста
function mix(text) {
    let array = text[0].split(" ")
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
    
        // поменять элементы местами
        // мы используем для этого синтаксис "деструктурирующее присваивание"
        // подробнее о нём - в следующих главах
        // то же самое можно записать как:
        // let t = array[i]; array[i] = array[j]; array[j] = t
        [array[i], array[j]] = [array[j], array[i]];
    }
    array = [array.join(" ")]
    return array
}

restart_btn.addEventListener('click', function(){
    stats.style.display = 'none'
    start()
})

// Фразы для вывода на экран
text_arr = [
    'пораженчество контекст вывевание ехидство трение кортик перепланировка общипывание темнолицая свинарка турбогенератор травинка оркестратор арба лесоруб конюшонок раскатчик фаталистичность воспламенение минимализм тензиометр провозгласительница отвисание свинооткорм продюсер кот зонт дерево лес уши жена муж спасибо мир какао кофе молоко хлеб страус папа мама брат сестра телефон привет прощание смушка эфиронос тафта эргограф раздаривание сотерн пугало училище благоденствие безрассудство прищуривание монизм смысл расстилка односоставность монорельс откровенность скрипение мартинизм недоработка полировка метемпсихоз подкрепление проставление гидрометрия елей рисовальщик приутюжка юродствование чернорясная скрадывание догма тархун буквализм вымачивание рокотание напружина близорукость горнорабочий базирование перегрунтовка статс-секретарь орлянка приспособленец сверстничество учан раздельность зоомагазин латания курильница дейтрон керосинка проформа установление колумбийка кроение черносмородиновая манна амнистированный перерасчет наперник пилигримство отклик кудесник вариант кримплен ассистент завышение разрешимость трезвенник накрахмаливание нагроможденность славист комсостав элефантиазис комплексность куток обрезок диспропорциональность узнавание виолончель побледнение краска прекос вылеживание агрохимик антабка задорина жизнелюбие консерватория антрепренер подстрагивание флокс лжетолкование вертикаль марселин славяновед грамматист иллириец исцелительница аббат приарендовывание патан гитлеризм познание непрочность мотогонщик тред-юнионизм переплетчица задорность блузка монокультура выпивание перетлевание сваебоец расфасовщик претор верность накрывальщик лисель несерьезность урбанистка пеленка футуролог дисгармоничность клоп директор наусник обвоз новогодие секунд-майор шванк астронавигация кривизна аргентина пироксилин металлолом обычай подрубка отходчивость бактериофаг бадминтонист аптекоуправление братан соболевание спайщица аэронавтика гидромонтажник камлот завизирование космоплавание горицвет пучение клетчатка дубняк аденовирус гуммигут эндемизм ездок субалтерн-офицер безнадежность яблоко ликование радиотелеграф просолка супница гомункул суржа наименование подшлемник перекантовка расстрелянная отпускник сахаризация'
]

text_arr = mix(text_arr) // Перемещивание текста
fill_text() // обработка текста и вывод на экран
trackKeyboardActivity() // запуск отслеживания нажатия клавиш

// таймер 
var tick = start_timer()







