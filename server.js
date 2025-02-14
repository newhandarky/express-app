import https from 'https';
import fs from 'fs';
import app from './app.js'; // 假設你的 Express 應用程式在 app.js 中

// HTTPS 憑證配置
const options = {
    key: fs.readFileSync('./certs/private-key.pem'),
    cert: fs.readFileSync('./certs/certificate.pem'),
};

// 啟動 HTTPS 伺服器
const PORT = process.env.PORT || 3001;
https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS server is running on https://localhost:${PORT}`);
});
