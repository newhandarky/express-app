
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
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

// const port = process.env.PORT || "4000";

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


const webhookRouter = express.Router();

webhookRouter.get('/hello', (req, res) => {
    res.send('hello world in webhook');
});

// 測試自動回傳訊息給用戶
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

// 主動發送訊息的 API 路由
webhookRouter.post('/send-message', async (req, res) => {
    const { userId, message } = req.body;

    if (!userId || !message) {
        return res.status(400).send('缺少 userId 或 message');
    }

    try {
        // 發送 Push Message 的請求
        const response = await axios.post(
            'https://api.line.me/v2/bot/message/push',
            {
                to: userId,
                messages: [
                    {
                        type: 'text',
                        text: message,
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
                },
            }
        );

        console.log('訊息發送成功:', response.data);
        res.status(200).send('訊息已成功發送');
    } catch (error) {
        console.error('發送訊息失敗:', error.response?.data || error.message);
        res.status(500).send('發送訊息失敗');
    }
});


// GET 跌路
webhookRouter.get('/', async (req, res) => {
    try {
        // 測試回傳訊息
        res.status(200).send('Webhook 路由測試成功！！！');
    } catch (error) {
        console.error('處理 /webhook/ 請求時發生錯誤:', error);
        res.status(500).send('伺服器錯誤');
    }
});

export default webhookRouter;
