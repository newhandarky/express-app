import ngrok from 'ngrok';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || "3001";
const NGROK_AUTHTOKEN = process.env.NGROK_AUTHTOKEN;

(async function () {
    const url = await ngrok.connect({
        // 你的後端服務運行的本地端口
        addr: port,
        // 從 Ngrok Dashboard 獲取
        authtoken: NGROK_AUTHTOKEN,
    });
    console.log(`Ngrok URL: ${url}`);
})();
