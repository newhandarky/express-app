import axios from 'axios';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
// import liff from '@line/liff';

dotenv.config();

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN; // 替換為你的 Channel Access Token

// 發送樣板語言
const messageTemplate = {
    "type": "template",
    "altText": "This is a buttons template",
    "template": {
        "type": "buttons",
        "thumbnailImageUrl": "https://pgw.udn.com.tw/gw/photo.php?u=https://uc.udn.com.tw/photo/2024/03/21/0/29251088.jpg&s=Y&x=0&y=0&sw=940&sh=627&exp=3600",
        "imageAspectRatio": "rectangle",
        "imageSize": "cover",
        "imageBackgroundColor": "#FFFFFF",
        "title": "Menu",
        "text": "Please select",
        "defaultAction": {
            "type": "uri",
            "label": "View detail",
            "uri": "https://testliff.onrender.com"
        },
        "actions": [
            {
                "type": "uri",
                "label": "View detail",
                "uri": "https://testliff.onrender.com"
            }
        ]
    }
}

const templateMessage = {
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
}

export async function sendMessage(userId, message) {
    try {
        const response = await axios.post(
            'https://api.line.me/v2/bot/message/push',
            {
                to: userId,
                messages: [{ type: 'text', text: message }, templateMessage],
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
