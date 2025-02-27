import createError from 'http-errors';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import lineLoginRouter from './routes/line-login.js';
import webhookRouter from './routes/webhook.js';



dotenv.config();
const app = express();

// 使用中介軟體
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 啟用 CORS，允許來自特定來源的請求
app.use(cors({
  origin: process.env.CROS_URL, // 允許的前端域名
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允許的 HTTP 方法
  allowedHeaders: ['Content-Type', 'Authorization'], // 允許的標頭
}));

app.options('*', cors({
  origin: process.env.CROS_URL,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('/webhook/send-flex-message', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CROS_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200); // 回應成功狀態碼
});


// app.use(express.static(path.join(frontendPath, 'public')));

// 路由設定
// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/webhook', webhookRouter);
app.use('/line-login', lineLoginRouter);

// 基本路由
app.get('/', (req, res) => {
  res.send('Hello, HTTPS!');
});

app.get('/hello', (req, res) => {
  res.send('hello world in App.js');
});

// 捕捉未找到的路由（404）並轉發到錯誤處理器
app.use(function (req, res, next) {
  res.status(404).json({ error: 'Page not found' });
  next(createError(404));
});

// 錯誤處理器
app.use(function (err, req, res, next) {
  // 設定本地變數，只在開發環境提供錯誤訊息
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 渲染錯誤頁面
  res.status(err.status || 500).json({ error: err.message });
  res.status(err.status || 500);
  res.render('error');

});

export default app;

