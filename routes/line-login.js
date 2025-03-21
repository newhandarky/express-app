import express from 'express';
import axios from 'axios'; // 如果需要在這裡使用 axios
import crypto from 'crypto';
// import jwt from 'jsonwebtoken';

const lineLoginRouter = express.Router();


lineLoginRouter.get('/callback', async (req, res) => {
    console.log("成功呼叫？");

    const state = crypto.randomBytes(16).toString('hex');
    req.session.state = state; // 存儲在 Session 中

    // 後端在處理 Callback 請求時，從查詢參數中提取 code
    const { code } = req.query;

    // try {
    //     // 用授權碼交換 Access Token
    //     const tokenResponse = await axios.post(
    //         'https://api.line.me/oauth2/v2.1/token',
    //         new URLSearchParams({
    //             grant_type: 'authorization_code',
    //             code,
    //             redirect_uri: process.env.REDIRECT_URI,
    //             client_id: process.env.LINE_LOGIN_CHANNEL_ID,
    //             client_secret: process.env.CHANNEL_SECRET,
    //             state
    //         }),
    //         { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    //     );

    //     const accessToken = tokenResponse.data.access_token;

    //     // 使用 Access Token 獲取用戶資料
    //     const profileResponse = await axios.get('https://api.line.me/v2/profile', {
    //         headers: { Authorization: `Bearer ${accessToken}` },
    //     });

    //     res.json(profileResponse.data);
    //     console.log(profileResponse.data, "oauth2/v2.1/token回傳資料");

    // } catch (error) {
    //     console.error(error, 'callback 呼叫失敗');
    //     res.status(500).send('Login failed');
    // }

    try {
        // 用授權碼交換 Access Token
        const tokenResponse = await axios.post(
            'https://api.line.me/oauth2/v2.1/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.REDIRECT_URI,
                client_id: process.env.LINE_LOGIN_CHANNEL_ID,
                client_secret: process.env.CHANNEL_SECRET,
                state
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const accessToken = tokenResponse.data.access_token;

        // 使用 Access Token 獲取用戶資料
        const profileResponse = await axios.get('https://api.line.me/v2/profile', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        // 將登入狀態存入 sessionStorage
        const loginState = {
            isLoggedIn: true,
            accessToken: accessToken,
            profile: profileResponse.data,
            timestamp: new Date().toISOString()
        };

        // 回傳用戶資料
        res.json(profileResponse.data);

        console.log('line login success', profileResponse.data);

        localStorage.setItem('loginState', JSON.stringify(loginState));
    } catch (error) {
        console.error(error, 'callback 呼叫失敗');
        res.status(500).send('Login failed');
    }

});

export default lineLoginRouter;
