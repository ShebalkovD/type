let heading = document.querySelector('.text') // тег, который отображает текст
let stats = document.querySelector('.stats') // тег, который отображает статистику
let stats_speed = document.getElementById('speed') // тег, который отображает скорость
let stats_mistakes = document.getElementById('mistakes') // тег, который отображает кол-во ошибок
let stats_accuracy = document.getElementById('accuracy') // тег, который отображает точность
let stats_img = document.querySelector('.stats_img') // картинка в статистике
let timer = document.getElementById('timer') // тег, который отображает время
let type_cat = document.querySelector('.type_cat') // картинка кота над текстом

let dark_screen = document.querySelector('.dark_screen') // затемнение экрана

let restart_btn = document.querySelector('.restart') // кнопка заново
let eng_btn = document.getElementById('mode_eng') // кнопка смены языка на англиский
let rus_btn = document.getElementById('mode_rus') // кнопка смены языка на русский
let time30_btn = document.getElementById('mode_30') // кнопка смены таймера на 30 сек
let time60_btn = document.getElementById('mode_60') // кнопка смены таймера на 60 сек

let type_cat_state = false // состояние анимации кота
let isStart = true // состояние тренажера (вкл/выкл отслеживания события нажатия на клавишу)
let language_mode = 'rus' // языковой режим

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
let time_multiplier = 1 // множитель времени

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
    isStart = false

    if (language_mode === 'rus') {
        text_arr[0] = rus_text
    } else {
        text_arr[0] = eng_text
    }

    text_arr = mix(text_arr) // Перемещивание текста
    i = 0
    sign_counter = 0
    mistakes = 0
    text_shift = 0

    heading.style.transform = `translateX(calc(20%))` // сдвиг сроки
    type_cat.setAttribute('src', 'src/cat-still.png')
    stats_img.setAttribute('src', ' ')
    heading.style.color = 'gray'

    dark_screen.classList.remove('dark_screen_active')
    
    fill_text()
    clearInterval(tick)
    clearTimeout(timer_id)
    start()
    // console.log('Таймер СТОП');
}  

// вывод статистики на экран
function set_stats() {
    dark_screen.classList.add('dark_screen_active')

    spm = Math.round(sign_counter*time_multiplier/5) // расчет скорости в wpm (слова в минуту)

    stats_speed.innerHTML = `${spm} слов в минуту`
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

    stats.style.display = 'flex' // открытие окна статистики


    // console.log('Кол-во символов:', sign_counter);
    // console.log('Слов в минуту:', spm);
    // console.log('Точность:', accuracy);
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
        set_stats()
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
            }
            // если нажата неверная клавиша 
            else {
                type_cat.setAttribute('src', 'src/cat-still.png') // смена картинки кота

                // сброс тренажера при нажатии сочетания клавиш (Ctrl + Enter)
                if (keyCode === 'Enter' && (event.ctrlKey || event.metaKey)){
                    dark_screen.classList.remove('dark_screen_active')
                    stats.style.display = 'none'
                    reset()
                }
                else {
                    mistakes++
                    // вывод ошибки на экран
                    children[i].style.color = 'red'
                    // console.log('ERROR!' + number)
                }
            }
        }
        
    })
}

// Перемешивание текста
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

// обработка клика на кнопку рестарт
restart_btn.addEventListener('click', function() { 
    dark_screen.classList.remove('dark_screen_active')
    stats.style.display = 'none'
    reset()
})

// смена языкового режима
eng_btn.addEventListener('click', function() {
    stats.style.display = 'none'
    language_mode = 'eng'
    rus_btn.classList.remove('mode_active')
    eng_btn.classList.add('mode_active')
    reset()
})

// смена языкового режима
rus_btn.addEventListener('click', function() {
    stats.style.display = 'none'
    language_mode = 'rus'
    eng_btn.classList.remove('mode_active')
    rus_btn.classList.add('mode_active')
    reset()
})

// смена временного режима
time30_btn.addEventListener('click', function() {
    stats.style.display = 'none'
    time = 30
    time_multiplier = 2
    time60_btn.classList.remove('mode_active')
    time30_btn.classList.add('mode_active')
    reset()
})

// смена временного режима
time60_btn.addEventListener('click', function() {
    stats.style.display = 'none'
    time = 60
    time_multiplier = 1
    time30_btn.classList.remove('mode_active')
    time60_btn.classList.add('mode_active')
    reset()
})

// Фразы для вывода на экран
text_arr = []
let rus_text = 'пораженчество контекст вывевание ехидство трение кортик перепланировка общипывание темнолицая свинарка турбогенератор травинка оркестратор арба лесоруб конюшонок раскатчик фаталистичность воспламенение минимализм тензиометр провозгласительница отвисание свинооткорм продюсер кот зонт дерево лес уши жена муж спасибо мир какао кофе молоко хлеб страус папа мама брат сестра телефон привет прощание смушка эфиронос тафта эргограф раздаривание сотерн пугало училище благоденствие безрассудство прищуривание монизм смысл расстилка односоставность монорельс откровенность скрипение мартинизм недоработка полировка метемпсихоз подкрепление проставление гидрометрия елей рисовальщик приутюжка юродствование чернорясная скрадывание догма тархун буквализм вымачивание рокотание напружина близорукость горнорабочий базирование перегрунтовка статс-секретарь орлянка приспособленец сверстничество учан раздельность зоомагазин латания курильница дейтрон керосинка проформа установление колумбийка кроение черносмородиновая манна амнистированный перерасчет наперник пилигримство отклик кудесник вариант кримплен ассистент завышение разрешимость трезвенник накрахмаливание нагроможденность славист комсостав элефантиазис комплексность куток обрезок диспропорциональность узнавание виолончель побледнение краска прекос вылеживание агрохимик антабка задорина жизнелюбие консерватория антрепренер подстрагивание флокс лжетолкование вертикаль марселин славяновед грамматист иллириец исцелительница аббат приарендовывание патан гитлеризм познание непрочность мотогонщик тред-юнионизм переплетчица задорность блузка монокультура выпивание перетлевание сваебоец расфасовщик претор верность накрывальщик лисель несерьезность урбанистка пеленка футуролог дисгармоничность клоп директор наусник обвоз новогодие секунд-майор шванк астронавигация кривизна аргентина пироксилин металлолом обычай подрубка отходчивость бактериофаг бадминтонист аптекоуправление братан соболевание спайщица аэронавтика гидромонтажник камлот завизирование космоплавание горицвет пучение клетчатка дубняк аденовирус гуммигут эндемизм ездок субалтерн-офицер безнадежность яблоко ликование радиотелеграф просолка супница гомункул суржа наименование подшлемник перекантовка расстрелянная отпускник сахаризация'
let eng_text = 'make-up poetics cat dog sandwich apple an oracle miracle good evil chicken have been hello neighbour weekend inviolability promise skier insulation Dec convulsion patrimony vocalist tower worker geography pilgrimage merger progression squeezing lodger landlessness azan escorting wingedness cutter assimilator drying Swede shaking conduit regret ceiling grandeur sinking pushing river ceiling seljuk LYING Enoch charge gummy usability ointment puncture reference point water jet gasket lycopodium sycamore monster flow fiction writer reprobate taxation adaptability narcology homeless depth salolin elodea stitching herr couch mortar man descendant monopoly baggage controversy pseudo-crystal height creeping oiler Hebrew intriguer endocarditis bleacher martingale rewinding slain psychoanalysis trituration schenkel and he retraction stepping over relegation rewarding libertine alder entrepreneur presswoman abduction tradescantia andesite bulging driving contestant restoration conocrad biathlon bell injector loader smoke exhaust predestination Pythagorean accordionist calibration erythrocyte information electromagnet flax spinner scholasticism social science landver teska turf sample polyglot uninhabited oak tree lack of curiosity beetle adaptometer slaughter decree polendwitz pathology prigarina tungsten slaughter lakeside shaving meditation shield bite imagination tuta yunnat palm laurel newsreel identification Azerbaijani have left corrector urine feed mednitskaya thyme singleness headband burlak coiler periostitis motto idealism niobium attachment shovel reminder Turkism Phoenician fisheries wrapping schnitzel loading bike sharing swimmer duration growth mystery pantomimist performance resection subdivision Scot electric bulb well-wisher exot lack of intelligence foreman anti vitamin amateur dove rammer break spinning player rapprochement chicken drug mafia forehead prevailing northeast transom grandson specially authorized tuberosity nomarch ham'

// таймер 
var tick = start_timer()

reset()
text_arr = mix(text_arr) // Перемешивание текста
fill_text() // обработка текста и вывод на экран
trackKeyboardActivity() // запуск отслеживания нажатия клавиш







