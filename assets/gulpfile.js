const gulp = require('gulp');
const RevAll = require('gulp-rev-all');


gulp.task('revall', function () {
    return gulp.src('dist/**')
        .pipe(RevAll.revision({
            dontGlobal: [
                // Skip leaflet markers that are referenced via Javascript
                /marker-icon.png$/,
                /marker-icon-2x.png$/,
                /marker-shadow.png$/
            ],
            dontSearchFile: [
                /^.*woff2$/,
                /^.*woff$/,
                /^.*ttf$/,
                /^.*png$/,
                /^.*svg$/
            ],
            includeFilesInManifest: ['.css', '.js', '.ico', '.svg', '.png']
        }))
        .pipe(gulp.dest('dist'))
        .pipe(RevAll.manifestFile())
        .pipe(gulp.dest('dist'));
});
