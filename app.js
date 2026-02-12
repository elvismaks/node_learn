var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const adminAuth = require('./middlewares/admin-auth');
const userAuth = require('./middlewares/user-auth');
require('dotenv').config()
const cors = require('cors')




//Front-end
var indexRouter = require('./routes/index');

const categoriesRouter = require('./routes/categories');
const coursesRouter = require('./routes/courses');
const chaptersRouter = require('./routes/chapters');
const articlesRouter = require('./routes/articles');
const settingsRouter = require('./routes/settings');
const searchRouter = require('./routes/search');
const authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
const likesRouter = require('./routes/likes');
const postsRouter = require('./routes/posts');

//Back-end
var adminArticalesRouter = require('./routes/admin/articles')
var adminCategoriesRouter = require('./routes/admin/categories')
var adminSettingsRouter = require('./routes/admin/settings')
var adminUsersRouter = require('./routes/admin/users');
var adminCoursesRouter = require('./routes/admin/courses');
var adminChaptersRouter = require('./routes/admin/chapters');
var adminEChartsRouter = require('./routes/admin/echarts');
const adminAuthRouter = require('./routes/admin/auth');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors()); //需在路由後使用

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/courses', coursesRouter);
app.use('/chapters', chaptersRouter);
app.use('/articles', articlesRouter);
app.use('/settings', settingsRouter);
app.use('/search', searchRouter);
app.use('/auth', authRouter);
app.use('/users', userAuth, usersRouter);
app.use('/likes', userAuth, likesRouter);
app.use('/posts', postsRouter);
//back-end router config
app.use('/admin/articles', adminAuth, adminArticalesRouter)
app.use('/admin/categories', adminAuth, adminCategoriesRouter)
app.use('/admin/settings', adminAuth, adminSettingsRouter)
app.use('/admin/users', adminAuth, adminUsersRouter);
app.use('/admin/courses', adminAuth, adminAuth, adminCoursesRouter);
app.use('/admin/chapters', adminAuth, adminChaptersRouter);
app.use('/admin/echarts', adminAuth, adminEChartsRouter);
app.use('/admin/auth', adminAuthRouter); //除了登入接口路由其他都要加上中間件作接口驗証
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;