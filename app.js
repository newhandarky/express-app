const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// 使用 body-parser 解析 JSON
app.use(bodyParser.json());

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

// 處理未找到的路由（404）
app.use((req, res, next) => {
  console.log(`404 Error: ${req.originalUrl} not found.`);
  res.status(404).send('404 Not Found');
});

// 處理伺服器錯誤（500）
app.use((err, req, res, next) => {
  console.error('500 Error:', err.stack);
  res.status(500).send('500 Internal Server Error');
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;


