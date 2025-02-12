const express = require('express');
const axios = require('axios');

const app = express();
require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
app.get('/line-login/callback', async (req, res) => {
    const { code, state } = req.query;

    try {
        // 用授權碼交換 Access Token
        const tokenResponse = await axios.post(
            'https://api.line.me/oauth2/v2.1/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const accessToken = tokenResponse.data.access_token;

        // 使用 Access Token 獲取用戶資料
        const profileResponse = await axios.get('https://api.line.me/v2/profile', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        res.json(profileResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Login failed');
    }
});

app.listen(2999, () => {
    console.log('Server is running on port 2999');
});
