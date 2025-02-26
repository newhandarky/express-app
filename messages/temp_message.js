import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

// 請替換以下變數
const CHANNEL_ACCESS_TOKEN = 'YOUR_CHANNEL_ACCESS_TOKEN';
const TARGET_USER_ID = 'TARGET_USER_ID';

const flexMessage = {
    "type": "bubble",
    "hero": {
        "type": "image",
        "url": "https://developers-resource.landpress.line.me/fx/img/01_1_cafe.png",
        "size": "full",
        "aspectRatio": "20:13",
        "aspectMode": "cover",
        "action": {
            "type": "uri",
            "uri": "https://liff.line.me/2006884711-Q5r6z736"
        }
    },
    "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
            {
                "type": "text",
                "text": "Brown Cafe",
                "weight": "bold",
                "size": "xl"
            },
            {
                "type": "box",
                "layout": "baseline",
                "margin": "md",
                "contents": [
                    {
                        "type": "icon",
                        "size": "sm",
                        "url": "https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png"
                    },
                    {
                        "type": "icon",
                        "size": "sm",
                        "url": "https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png"
                    },
                    {
                        "type": "icon",
                        "size": "sm",
                        "url": "https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png"
                    },
                    {
                        "type": "icon",
                        "size": "sm",
                        "url": "https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png"
                    },
                    {
                        "type": "icon",
                        "size": "sm",
                        "url": "https://developers-resource.landpress.line.me/fx/img/review_gray_star_28.png"
                    },
                    {
                        "type": "text",
                        "text": "4.7",
                        "size": "sm",
                        "color": "#999999",
                        "margin": "md",
                        "flex": 0
                    }
                ]
            },
            {
                "type": "box",
                "layout": "vertical",
                "margin": "lg",
                "spacing": "sm",
                "contents": [
                    {
                        "type": "box",
                        "layout": "baseline",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "text",
                                "text": "Place",
                                "color": "#aaaaaa",
                                "size": "sm",
                                "flex": 1
                            },
                            {
                                "type": "text",
                                "text": "Flex Tower, 7-7-4 Midori-ku, Tokyo",
                                "wrap": true,
                                "color": "#666666",
                                "size": "sm",
                                "flex": 5
                            }
                        ]
                    },
                    {
                        "type": "box",
                        "layout": "baseline",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "text",
                                "text": "Time",
                                "color": "#aaaaaa",
                                "size": "sm",
                                "flex": 1
                            },
                            {
                                "type": "text",
                                "text": "10:00 - 23:00",
                                "wrap": true,
                                "color": "#666666",
                                "size": "sm",
                                "flex": 5
                            }
                        ]
                    }
                ]
            }
        ]
    },
    "footer": {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "contents": [
            {
                "type": "button",
                "style": "link",
                "height": "sm",
                "action": {
                    "type": "uri",
                    "label": "WEBSITE",
                    "uri": "https://liff.line.me/2006884711-Q5r6z736"
                }
            },
            {
                "type": "box",
                "layout": "vertical",
                "contents": [],
                "margin": "sm"
            }
        ],
        "flex": 0
    }
};

app.post('/send-flex-message', async (req, res) => {
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
        console.log('卡片形訊息發送結果:', response.data);
        res.status(200).send('Flex Message 發送成功');
    } catch (error) {
        console.error('錯誤:', error.response?.data || error.message);
        res.status(500).send('發送失敗');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
