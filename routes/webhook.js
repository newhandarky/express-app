
import express from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
import axios from 'axios';


import { sendMessage, getFollowers } from '../services/lineMessaging.js'; // 引入剛建立的模組
import { log } from 'console';
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

webhookRouter.get('/', async (req, res) => {
    try {
        // 測試回傳訊息
        res.status(200).send('Webhook 路由測試成功！！！');
    } catch (error) {
        console.error('處理 /webhook/ 請求時發生錯誤:', error);
        res.status(500).send('伺服器錯誤');
    }
});

webhookRouter.get('/hello', (req, res) => {
    res.send('hello world in webhook');
});

webhookRouter.get('/get-followers', (req, res) => {
    console.log(req, "成功呼叫？", res)

    getFollowers()
        .then(response => {
            console.log('追隨者清單:', response);
            res.status(200).send(JSON.stringify(response.data));
        })
        .catch(error => {
            console.error('取得好友數量失敗, in webhook :', error);
            res.status(500).send({ error: '取得好友數量失敗 in webhook' });
        });
});

// 測試自動回傳訊息給用戶
webhookRouter.post('/', async (req, res) => {
    const response = await shareTarget("GGGGGG", true)
        .then(function (res) {
            res.status(200).send(response.data);
        }).catch(function (err) {
            console.log('失敗', err);

        })

});


webhookRouter.post('/send-flex-message', async (req, res) => {
    const { userId, defaultMessage } = req.body;
    // 定義 Flex Message 結構
    const flexMessage = {
        to: userId, // 接收者 ID
        defaultMessage
    };
    try {
        const response = await axios.post(
            'https://api.line.me/v2/bot/message/push',
            // ... 保持原有的 Flex Message JSON 結構不變 ...
            // (此處內容與之前範例完全一致，為節省篇幅省略)
            flexMessage,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
                }
            }
        );
        console.log("userId", userId),
            console.log('卡片形訊息發送結果:', response.data);
        res.status(200).send('Flex Message 發送成功');
    } catch (error) {
        console.error('錯誤:', error.response?.data || error.message);
        res.status(500).send('發送失敗:', error.response?.data || error.message);
    }
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

export default webhookRouter;
