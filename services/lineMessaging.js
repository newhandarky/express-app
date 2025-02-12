import axios from 'axios';

const CHANNEL_ACCESS_TOKEN = 'YOUR_CHANNEL_ACCESS_TOKEN'; // 替換為你的 Channel Access Token

async function sendMessage(userId, message) {
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
        console.error('儲存用戶資料失敗:', error);
        // console.error('訊息推送失敗:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { sendMessage };
