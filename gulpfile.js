import gulp from 'gulp';
import browserSync from 'browser-sync';

import gulpsass from 'gulp-sass';
import sasscomp from 'sass';
const sass = gulpsass(sasscomp);

import concat from "gulp-concat";
import cleancss from 'gulp-clean-css';

const bsInstance = browserSync.create();
const outputPath = './dist';
const assetsOutputPath = outputPath.concat('/assets')

function browsersync() {
    bsInstance.init({
        server: { baseDir: outputPath },
        notify: false,
        online: false
    });
}

function pages() {
    return gulp.src('app/index.html')
        .pipe(gulp.dest(outputPath))
        .pipe(bsInstance.stream());
}

function styles() {
    return gulp.src('app/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(outputPath))
        .pipe(concat('styles.min.css'))
        .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
        .pipe(gulp.dest(outputPath))
        .pipe(bsInstance.stream());
}

function tokens() {
    return gulp.src('app/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(outputPath))
        .pipe(concat('styles.min.css'))
        .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
        .pipe(gulp.dest(outputPath))
        .pipe(bsInstance.stream());
}

function assets() {
    return gulp.src('app/assets/*.*')
        .pipe(gulp.dest(assetsOutputPath))
        .pipe(bsInstance.stream());
}

function startwatch() {
    gulp.watch('app/*.html').on('change', () => {
        pages();
        bsInstance.reload;
    });
    gulp.watch('app/*.scss').on('change', () => {
        styles();
        bsInstance.reload;
    });
    gulp.watch('app/scss/*.scss').on('change', () => {
        styles();
        bsInstance.reload;
    });
    gulp.watch('app/assets/*.*').on('change', () => {
        pages();
        bsInstance.reload;
    });
}

const build = gulp.series(gulp.parallel(pages, styles, tokens, assets));
const serve = gulp.series(build, gulp.parallel(browsersync, startwatch));

export {
    build,
    serve
}

export default build;