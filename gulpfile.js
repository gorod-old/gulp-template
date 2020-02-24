var path = require('path'),
    fs = require('fs'),
    gulp = require('gulp'), // Подключаем Gulp
    sass = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync = require('browser-sync'), // Подключаем Browser Sync
    concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer'); // Подключаем библиотеку для автоматического добавления префиксов


gulp.task('scss', async function () { // Создаем таск Sass
    return gulp.src('app/scss/**/*.scss') // Берем источник
        .pipe(sass({
            outputStyle: 'compressed'
        })) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 8 versions']
        }))
        // .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({
            stream: true
        })) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', async function () { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        // 
        proxy: "gulp-test-php.dev", //domain in OSPanel/domains(openserver)
        notify: false // Отключаем уведомления
    });
});

gulp.task('scripts', async function () {
    return gulp.src([ // Берем все необходимые библиотеки
            'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
            //'app/libs/jquery/dist/jquery.slim.min.js', // Берем jQuery  
            'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js', // Берем Magnific Popup          
            'app/libs/bootstrap/dist/js/bootstrap.min.js',
            'app/libs/wow/dist/wow.min.js',
            'app/libs/parallax.js/parallax.min.js',
        ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

//jquery js lib separately
gulp.task('jquery', async function () {
    return gulp.src([ // Берем все необходимые библиотеки           
            'app/libs/jquery/dist/jquery.min.js', // Берем jQuery           
        ])
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('code', function () {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('php', function () {
    return gulp.src('app/**/*.php')
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('css-libs', function () {
    return gulp.src('app/scss/libs.scss') // Выбираем файл для минификации
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({
            suffix: '.min'
        })) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css        
});

// move animate.min.css to css folder
gulp.task('css-libs-animate', function () {

    return gulp.src('app/libs/animate.css/animate.min.css')
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css        
});

// import scss from templates folder
gulp.task('tpl-scss', async function () {

    var dir = 'app/import';
    var scss_file = "";

    function fromDir(startPath, filter){

        if (!fs.existsSync(startPath)){
            console.log("no dir ", startPath);
            return;
        }
        // get all files from the startPath folder
        var files = fs.readdirSync(startPath);

        for(var i = 0; i < files.length; i++)
        {
            var filename=path.join(startPath,files[i]);
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory()){

                fromDir(filename,filter); //recurse                
            }
            else if (filename.indexOf(filter)>=0) {
                
                console.log('-- found: ',filename);
                var str = '\n@import "' + filename + '";';
                str = str.replace(/\\/g, '/');               
                if(scss_file.indexOf(str) == -1)
                    scss_file = scss_file.concat(str);                    
            }
        }
    }  
    
    var file = 'app/scss/import.scss'; 
    // Check if the file exists in the current directory, and if it is writable.
    fs.access(file, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
            console.error(
                `${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`); 
        } 
        else {
            console.log(`${file} exists, and it is writable`);
        }
    });
    // находим по очереди все scss файлы в папке import и дописываем строки импорта 
    fromDir(dir,'.scss');  
    fs.writeFileSync(file, scss_file);
});

// remove dist folder
gulp.task('dist-clean', async function () {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function () {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({ // С кешированием
            // .pipe(imagemin({ // Сжимаем изображения без кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })) /**/ )
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('prebuild', async function () {

    var buildCss = gulp.src('app/css/**/*')
        .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
        .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
        .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
        .pipe(gulp.dest('dist'));

    var buildPhp = gulp.src('app/php-tpl/**/*.php') // Переносим php в продакшен
        .pipe(gulp.dest('dist/php-tpl')); 

    var buildPhp = gulp.src('app/import/**/*.php') // Переносим php в продакшен
        .pipe(gulp.dest('dist/import'));   

    var buildRootPhp = gulp.src('app/*.php') // Переносим php в продакшен
        .pipe(gulp.dest('dist'));      

});

gulp.task('clear-cache', function (callback) {
    return cache.clearAll();
})

gulp.task('watch', async function () {
    gulp.watch('app/scss/**/*.scss', gulp.parallel('scss')); // Наблюдение за sass файлами  
    gulp.watch('app/import/**/*.scss', gulp.parallel('scss')); // Наблюдение за sass файлами 
    gulp.watch('app/*.html', gulp.parallel('code')); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/**/*.php', gulp.parallel('php')); // Наблюдение за php файлами
    gulp.watch(['app/js/main.js', 'app/libs/**/*.js'], gulp.parallel('scripts')); // Наблюдение за главным JS файлом и за библиотеками
});
gulp.task('default', gulp.series(gulp.parallel('css-libs-animate', 'tpl-scss'), gulp.parallel('scss', 'scripts', 'browser-sync', 'watch')));
gulp.task('build', gulp.series(gulp.parallel('dist-clean', 'scss', 'scripts'), gulp.parallel( 'prebuild', 'img')));