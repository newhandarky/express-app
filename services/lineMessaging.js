import axios from 'axios';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
// import liff from '@line/liff';

dotenv.config();

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN; // 替換為你的 Channel Access Token

export async function sendMessage(userId, message) {
    try {
        const response = await axios.post(
            'https://api.line.me/v2/bot/message/push',
            {
                to: userId,
                messages: [{ type: 'text', text: message }],
            },
            { headers: { Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}` } }
        );

        console.log('訊息推送成功:', response.data);
        return response.data;
    } catch (error) {
        console.error('訊息推送失敗:', error);
        console.log(error, "lineMessaging.23");
        throw error;
    }
}

export async function getFollowers() {
    try {
        const response = await axios.get(
            `https://api.line.me/v2/bot/insight/followers?date=${dayjs().format('YYYYMMDD')}`,
            { headers: { Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}` } }
        );
        return response;
    } catch (error) {
        // console.error('獲取追隨者失敗:', error);
        throw error;
    }
}
