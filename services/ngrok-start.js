import ngrok from 'ngrok';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || "3001";
const NGROK_AUTHTOKEN = process.env.NGROK_AUTHTOKEN;

(async function () {
    const url = await ngrok.connect({
        addr: port, // 你的後端服務運行的本地端口
        authtoken: NGROK_AUTHTOKEN, // 從 Ngrok Dashboard 獲取
    });
    console.log(`Ngrok URL: ${url}`);
})();
