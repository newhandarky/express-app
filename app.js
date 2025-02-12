var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 使用中介軟體
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 路由設定
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 處理 LINE Webhook 的路由
app.post('/webhook', (req, res) => {
  const body = req.body;

  // 確認請求是否有效
  if (!body || !body.events) {
    console.log('Received an invalid request or no events.');
    return res.sendStatus(200); // 回傳 HTTP 200 狀態碼
  }

  // 處理事件
  body.events.forEach((event) => {
    console.log('Received event:', event);

    if (event.type === 'message') {
      console.log('Message event received:', event.message);
      // 可根據需求處理訊息事件
    }
  });

  // 回應 HTTP 200 狀態碼
  res.sendStatus(200);
});

// 捕捉未找到的路由（404）並轉發到錯誤處理器
app.use(function (req, res, next) {
  next(createError(404));
});

// 錯誤處理器
app.use(function (err, req, res, next) {
  // 設定本地變數，只在開發環境提供錯誤訊息
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 渲染錯誤頁面
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
