
var roots = document.getElementsByClassName("fixed");
// loading disable
setTimeout(function () {
    
    if(document.getElementById('loading') != null)
    {
        document.getElementById('loading').style.display = 'none';
        for( ; !roots.undefined && roots.length > 0; )
            roots[roots.length - 1].classList.remove('fixed');
    }
}, 2000);

// hover in button
$(document).ready(function () {
    $('button.animated' || 'a.animated').hover(
        function () {
            $(this).addClass('pulse'); // Добавляем класс bounce
        },
        function () {
            $(this).removeClass('pulse'); // Убираем класс
        }
    )
});



$('.test-popup-link').magnificPopup({
    type: 'image'
    // other options
});

$('.parent-container').magnificPopup({
    delegate: 'a', // child items selector, by clicking on it popup will open
    type: 'image',
    gallery: {
        enabled: true
    }
    // other options
});



//search
var term_top = '',
    term = '';
$(document).ready(function () {
    document.getElementById('spterm-top').oninput = function(){
        clear();         
    }
});

function clear(){
    jQuery('span.highlight').each(function () { //удаляем старую подсветку
        jQuery(this).after(jQuery(this).html()).remove();   
        term = '';
        term_top = '';     
    });
}

jQuery(document).ready(function () {
    var minlen = 3; // минимальная длина слова
    var paddingtop = 140; // отступ сверху при прокрутке
    var scrollspeed = 500; // время прокрутки
    var keyint = 1000; // интервал между нажатиями клавиш
    var n = 0;
    var time_keyup = 0;
    var time_search = 0;


    jQuery('body').delegate('#spgo', 'click', function () {

        jQuery('#root').animate({
            scrollTop: jQuery('span.highlight:first').offset().top - paddingtop
        }, scrollspeed); // переход к первому фрагменту
    });

    function dosearch() {
        term = jQuery('#spterm').val();
        clear();
        var t = '';
        jQuery('div#srch').each(function () { // в селекторе задаем область поиска
            jQuery(this).html(jQuery(this).html().replace(new RegExp(term, 'ig'), '<span class="highlight">$&</span>')); // выделяем найденные фрагменты
            n = jQuery('span.highlight').length; // количество найденных фрагментов
            console.log('n = ' + n);
            if (n == 0)
                jQuery('#spresult').html('Nothing found');
            else
                jQuery('#spresult').html('Results: ' + n + '. <span class="splink" id="spgo">Go to</span>');
            if (n > 1) // если больше одного фрагмента, то добавляем переход между ними
            {
                var i = 0;
                jQuery('span.highlight').each(function (i) {
                    jQuery(this).attr('n', i++); // нумеруем фрагменты, более простого способа искать следующий элемент не нашел
                });
                jQuery('span.highlight').not(':last').attr({
                    title: 'Click to go to the next fragment'
                }).click(function () { // всем фрагментам, кроме последнего, добавляем подсказку
                    jQuery('body,html').animate({
                        scrollTop: jQuery('span.highlight:gt(' + jQuery(this).attr('n') + '):first').offset().top - paddingtop
                    }, scrollspeed); // переход к следующему фрагменту
                });
                jQuery('span.highlight:last').attr({
                    title: 'Click to return to the search form.'
                }).click(function () {
                    jQuery('body,html').animate({
                        scrollTop: jQuery('#spterm').offset().top - paddingtop
                    }, scrollspeed); // переход к форме поиска
                });
            }
        });
    }

    jQuery('#spterm').keyup(function () {
        var d1 = new Date();
        time_keyup = d1.getTime();
        if (jQuery('#spterm').val() != term) // проверяем, изменилась ли строка           
            if (jQuery('#spterm').val().length >= minlen) { // проверяем длину строки

                setTimeout(function () { // ждем следующего нажатия
                    var d2 = new Date();
                    time_search = d2.getTime();
                    if (time_search - time_keyup >= keyint) // проверяем интервал между нажатиями
                        dosearch(); // если все в порядке, приступаем к поиску
                }, keyint);                            
            }
            else {
                jQuery('#spresult').html('&nbsp'); // если строка короткая, убираем текст из DIVа с результатом 
                clear();
            }
    });

    if (window.location.hash != "") // бонус
    {
        var t = window.location.hash.substr(1, 50); // вырезаем текст
        jQuery('#spterm').val(t).keyup(); // вставляем его в форму поиска
        jQuery('#spgo').click(); // переходим к первому фрагменту
    }
});

jQuery(document).ready(function () {
    var minlen = 3; // минимальная длина слова
    var paddingtop = 140; // отступ сверху при прокрутке
    var scrollspeed = 500; // время прокрутки
    var keyint = 1000; // интервал между нажатиями клавиш
    var n = 0;
    var time_keyup = 0;
    var time_search = 0;


    jQuery('body').delegate('#spbt', 'click', function () {
        if(jQuery('span.highlight:first').offset() != null && jQuery('span.highlight:first').offset() != undefined)
            jQuery('body,html').animate({
                scrollTop: jQuery('span.highlight:first').offset().top - paddingtop
            }, scrollspeed); // переход к первому фрагменту
    });

    function dosearch() {
        term_top = jQuery('#spterm-top').val();
        clear();
        var t = '';
        jQuery('div#srch').each(function () { // в селекторе задаем область поиска
            jQuery(this).html(jQuery(this).html().replace(new RegExp(term_top, 'ig'), '<span class="highlight">$&</span>')); // выделяем найденные фрагменты
            n = jQuery('span.highlight').length; // количество найденных фрагментов
            console.log('n = ' + n);
            // if (n == 0)
            //     jQuery('#spresult').html('Nothing found');
            // else
            //     jQuery('#spresult').html('Results: ' + n + '. <span class="splink" id="spgo">Go to</span>');
            if (n > 1) // если больше одного фрагмента, то добавляем переход между ними
            {
                var i = 0;
                jQuery('span.highlight').each(function (i) {
                    jQuery(this).attr('n', i++); // нумеруем фрагменты, более простого способа искать следующий элемент не нашел
                });
                jQuery('span.highlight').not(':last').attr({
                    title: 'Click to go to the next fragment'
                }).click(function () { // всем фрагментам, кроме последнего, добавляем подсказку
                    jQuery('body,html').animate({
                        scrollTop: jQuery('span.highlight:gt(' + jQuery(this).attr('n') + '):first').offset().top - paddingtop
                    }, scrollspeed); // переход к следующему фрагменту
                });
                jQuery('span.highlight:last').attr({
                    title: 'Click to return to the search form.'
                }).click(function () {
                    jQuery('body,html').animate({
                        scrollTop: jQuery('#spterm-top').offset().top - paddingtop
                    }, scrollspeed); // переход к форме поиска
                });
            }
        });
    }

    jQuery('#spterm-top').keyup(function () {
        var d1 = new Date();
        time_keyup = d1.getTime();
        if (jQuery('#spterm-top').val() != term_top) // проверяем, изменилась ли строка
            if (jQuery('#spterm-top').val().length >= minlen) { // проверяем длину строки

                setTimeout(function () { // ждем следующего нажатия
                    var d2 = new Date();
                    time_search = d2.getTime();
                    if (time_search - time_keyup >= keyint) // проверяем интервал между нажатиями
                        dosearch(); // если все в порядке, приступаем к поиску
                }, keyint);                            
            }
            else
            {
                jQuery('#spresult').html('&nbsp'); // если строка короткая, убираем текст из DIVа с результатом 
                clear();
            }
    });

    if (window.location.hash != "") // бонус
    {
        var t = window.location.hash.substr(1, 50); // вырезаем текст
        jQuery('#spterm-top').val(t).keyup(); // вставляем его в форму поиска
        jQuery('#spgo').click(); // переходим к первому фрагменту
    }
});
