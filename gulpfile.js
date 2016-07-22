/**
 * cnpm install gulp gulp-rimraf gulp-ruby-sass gulp-cached gulp-uglify gulp-rename gulp-concat gulp-notify gulp-filter gulp-asset-rev gulp-cssnano gulp-imagemin browser-sync gulp-file-include gulp-autoprefixer gulp.spritesmith vinyl-buffer merge-stream gulp-path gulp-folders gulp-babel babel-preset-es2015 gulp-postcss postcss-reporter postcss-scss stylelint stylelint-config-standard gulp-sourcemaps gulp-eslint gulp-changed gulp-strip-debug eslint-config-airbnb-base eslint-plugin-import eslint --save-dev
 * @type {[type]}
 */
var gulp = require('gulp'), //基础库
	changed = require('gulp-changed'),
	rimraf = require('gulp-rimraf'), //删除
	sass = require('gulp-ruby-sass'), //sass
	cached = require('gulp-cached'), //缓存
	uglify = require('gulp-uglify'), //js压缩
	rename = require('gulp-rename'), //改名
	concat = require('gulp-concat'), //合并
	notify = require('gulp-notify'), //提醒
	filter = require('gulp-filter'), //过滤
	babel = require('gulp-babel'), //ES2015转换
	rev = require('gulp-asset-rev'), //添加 md5
	cssnano = require('gulp-cssnano'), //css合并
	sourcemaps = require('gulp-sourcemaps'),//css maps
	imagemin = require('gulp-imagemin'), //图片压缩
	browserSync = require('browser-sync'), //同步刷新
	fileinclude = require('gulp-file-include'), //嵌入
	autoprefixer = require('gulp-autoprefixer'), //前缀
	spritesmith = require('gulp.spritesmith'), //精灵图
	buffer = require('vinyl-buffer'),	//通道缓存
	merge = require('merge-stream'), //合并流
	path = require('path'), //路径
	folders = require('gulp-folders'), //文件夹分割
	reload = browserSync.reload, //reload
	// style检测
  postcss     = require('gulp-postcss'),
  reporter    = require('postcss-reporter'),
  syntax_scss = require('postcss-scss'),
  stylelint   = require('stylelint')
  //  js检测
  stripDebug = require('gulp-strip-debug'),// Strip console, alert, and debugger
  eslint = require('gulp-eslint');//js 测试

	
//path
var scssSrc = 'src/scss/**/*.scss', 
	cssDst = 'dist/css',
	jsSrc = 'src/js/**/*.js',
	jsDst = 'dist/js',
	imgSrc = 'src/img/**/*.{jpg,jpeg,png,gif}',
	imgDst = 'dist/img',
	htmlSrc = 'src/**/*.html',
	htmlDst = 'dist/',
	rootSrc = 'src/**/*',
	rootDst = './dist/**/*',
	spritefolders = 'src/assets/',
	spriteImgSrc = 'src/assets/**/*.png';


// sass检测
gulp.task("scss-lint", function() {
  var processors = [
    stylelint(),
    reporter({
      clearMessages: true,
    })
  ];
  return gulp.src(scssSrc)
    .pipe(postcss(processors, {syntax: syntax_scss}));
});

//sass
gulp.task('scss',['scss-lint'],function(){
		sass(scssSrc,{style:'expanded', sourcemap:true})
		.pipe(autoprefixer('last 99 version'))
		.pipe(rename({suffix:'.min'}))
		.pipe(cssnano())
		.pipe(concat('style.min.css'))
		.pipe(gulp.dest(cssDst))
		.pipe(filter(cssDst))
		.pipe(browserSync.reload({stream:true}))
		.pipe(notify("message:CSS task complete"))
});

//js
gulp.task('js',function(){
	gulp.src(jsSrc)
		.pipe(changed(jsSrc))
		.pipe(babel({ presets:['es2015']}))
		.pipe(cached('js'))
    .pipe(stripDebug())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
		.pipe(gulp.dest(jsDst))
		.pipe(rename({suffix:'.min.js'}))
		.pipe(uglify())
		.pipe(gulp.dest(jsDst))
		.pipe(notify("message:JS task complete"))
});

//img
gulp.task('img',function(){
	gulp.src(imgSrc)
		.pipe(cached('img'))
		.pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true, multipass: true}))
		.pipe(gulp.dest(imgDst))
		.pipe(notify("message:Image task complete"))
});

//html
gulp.task('html',function(){
	gulp.src(htmlSrc)
		.pipe(fileinclude())
		.pipe(rev())
		.pipe(gulp.dest(htmlDst))
});

//sprite image
gulp.task('sprite',folders(spritefolders, function (folder) {
	var spriteData = gulp.src(path.join(spritefolders, folder, '*.png')).pipe(spritesmith({
	imgName: 'sprite-' + folder + '.png',
    cssName: 'sprite-' + folder + '.css',
	cssOpts: {
      cssSelector : function (sprite) {
        // If this is a hover sprite, name it as a hover one (e.g. 'home-hover' -> 'home:hover')
        if (sprite.name.indexOf('_hover') !== -1) {
        	return '.icon-' + sprite.name.replace('_hover', ':hover');
          // Otherwise, use the name as the selector (e.g. 'home' -> 'home')
        }else if(sprite.name.indexOf('@2x')!==-1){
        	return '.icon-'+sprite.name.replace('@2x','--2x');
        } else {
          return '.icon-' + sprite.name;
        }
      }
    },
    algorithms:'binary-tree', //top-down | left-right | diagonal | alt-diagonal | biary-tree
	}));
	var imgStream = spriteData.img
		.pipe(buffer())
		.pipe(imagemin())
		.pipe(gulp.dest(imgDst));
	var cssStream = spriteData.css
		.pipe(cssnano())
		.pipe(gulp.dest(cssDst))
	return merge(imgStream,cssStream);
}));

//clean
gulp.task('rimraf',function(){
	gulp.src(rootDst,{read:false})
		.pipe(filter(['*','!lib/']))
		.pipe(rimraf());
});

//default
gulp.task('default',['rimraf','sprite','scss', 'js', 'img','html'],function(){
	gulp.start('serve');
});

//watch
gulp.task('serve',['scss','js','img','html'],function(){
	browserSync.init({
		server:"./dist/"
	});
	gulp.watch(scssSrc,['scss']).on('change',reload);
	gulp.watch(jsSrc,['js']).on('change',reload);
	gulp.watch(htmlSrc,['html']).on('change',reload);
	gulp.watch(imgSrc,['img']).on('change',reload);
	gulp.watch(spriteImgSrc,['sprite']).on('change',reload);
	gulp.watch([rootDst,'!dist/css/**/*']).on('change',reload);
})