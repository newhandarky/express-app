
import express from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';


import { sendMessage } from '../services/lineMessaging.js'; // 引入剛建立的模組
dotenv.config();

// 簽名驗證函數
function validateSignature(channelSecret, body, signature) {
    const hash = crypto
        .createHmac('SHA256', channelSecret)
        .update(body)
        .digest('base64');
    return hash === signature;
}

// 使用範例
const app = express();
app.use(express.json());

const CHANNEL_SECRET = process.env.CHANNEL_SECRET;
const port = process.env.PORT || "4000";

app.post('/webhook', (req, res) => {
    const signature = req.headers['x-line-signature'];
    const body = JSON.stringify(req.body);

    if (!validateSignature(CHANNEL_SECRET, body, signature)) {
        return res.status(401).send('Invalid signature');
    }

    // 處理 Webhook 事件
    console.log('Webhook event:', req.body);
    const events = req.body.events;
    events.forEach(event => {
        if (event.type === 'message' && event.message.type === 'text') {
            console.log(`收到訊息: ${event.message.text}`);
            // 在這裡可以加入進一步的邏輯，例如回應訊息或觸發其他行為
        } else {
            console.log('收到其他類型的事件:', event);
        }
    });

    res.status(200).send('OK');
});

app.get('/hello', (req, res) => {
    res.send('hello world in webhook');
});


// 測試傳送訊息給用戶
const webhookRouter = express.Router();

webhookRouter.post('/', express.json(), async (req, res) => {
    const events = req.body.events;

    for (const event of events) {
        if (event.type === 'message' && event.message.type === 'text') {
            const userId = event.source.userId;
            const userMessage = event.message.text;

            try {
                // 回應用戶訊息
                await sendMessage(userId, `你說的是：「${userMessage}」, 從 Render 後端發送訊息測試`);
            } catch (error) {
                console.error('回應用戶訊息失敗:', error);
            }
        }
    }

    res.status(200).send('OK');
});

// GET 跌路
webhookRouter.get('/', express.urlencoded({ extended: true }), async (req, res) => {
    const events = req.query.events; // 如果(GET請求的事件數組在query參數中)

    for (const event of events) {
        if (event.type === 'message' && event.message.type === 'text') {
            const userId = event.source.userId;
            const userMessage = event.message.text;

            try {
                await sendMessage(userId, `你說的是：「${userMessage}」, 從 Render 後端發送訊息測試`);
            } catch (error) {
                console.error('回應用戶訊息失敗:', error);
            }
        }
    }

    res.status(200).send('OK');
});


export default webhookRouter;
