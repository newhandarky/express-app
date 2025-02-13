import createError from 'http-errors';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

import { fileURLToPath } from 'url';

import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import lineLoginRouter from './routes/line-login.js';
import webhookRouter from './routes/webhook.js';


dotenv.config();
const app = express();

// 定義 __filename 和 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname, "__dirname", __filename, "__filename"); // 現在可以正常使用 __dirname

// 從環境變數讀取前端路徑
const frontendPath = path.resolve(__dirname, process.env.FRONTEND_PATH);

console.log("前端路徑:", frontendPath);


// view engine setup
app.set('views', path.join(frontendPath, 'views'));
app.set('view engine', 'ejs');

// 使用中介軟體
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(frontendPath, 'public')));

// 路由設定
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/webhook', webhookRouter);
app.use('/line-login', lineLoginRouter);

// 處理 LINE Webhook 的路由
app.post('/webhook', (req, res) => {
  const body = req.body;

  // 如果請求無效或沒有事件，也回傳 HTTP 200
  if (!body || !body.events) {
    console.log('Received an invalid request or no events.');
    return res.sendStatus(200); // 回傳 HTTP 200 狀態碼
  }

  // 處理事件
  body.events.forEach((event) => {
    console.log('Received event:', event);

    if (event.type === 'message') {
      console.log('Message event received:', event.message);
      // 根據需求處理訊息事件
    }
  });

  // 無論是否有處理到具體事件，都回應 HTTP 200
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

export default app;

