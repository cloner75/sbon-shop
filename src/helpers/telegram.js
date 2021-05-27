// Packages 

// Configs
import telegramConfig from '../configs/config';
import TelegramBot from 'node-telegram-bot-api';


class TelegramHelper {
    constructor(token) {
        this.bot = new TelegramBot(token);
    }
    /**
     * @description :: SendMessage
     * @param {object} input
     * @param {object} chat
     * @return sendMessage
     */
    async sendText(input) {
        try {
            await this.bot.sendChatAction(parseInt(input.chatId), telegramConfig.telegramMessageTypes.text.action);
            return await this.bot.sendMessage(parseInt(input.chatId), input.message, input.mode || { parse_mode: 'HTML' });
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    }

    /**
     * @description :: SendMessage
     * @param {object} input
     * @param {object} chat
     * @return sendMessage
     */
    async sendImage(input) {
        try {
            const { channelId, userId, supplementary, chatId, message } = input;
            await this.bot.sendChatAction(parseInt(chatId), telegramConfig.telegramMessageTypes.photo.action);
            return await this.bot.sendPhoto(parseInt(chatId), message.concat(`?channelId=${channelId}&userId=${userId}`), { caption: supplementary.origiName });
        } catch (err) {
            throw err;
        }
    }

    /**
     * @description :: SendMessage
     * @param {object} input
     * @param {object} chat
     * @return sendMessage
     */
    async sendFile(input) {
        try {
            const { chatId, message, supplementary, channelId, userId, mode } = input;
            Object.assign(mode, { caption: supplementary.origiName });
            await this.bot.sendChatAction(parseInt(chatId), telegramConfig.telegramMessageTypes.document.action);
            return await this.bot.sendDocument(parseInt(chatId), message.concat(`?channelId=${channelId}&userId=${userId}`), mode);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @description :: SendMessage
     * @param {object} input
     * @param {object} chat
     * @return sendMessage
     */
    async delete(input) {
        try {
            return (await this.bot.deleteMessage(parseInt(input.chatId), input.messageId));
        } catch (err) {
            throw err;
        }
    }

    /**
     * @description :: SendMessage
     * @param {object} input
     * @param {object} chat
     * @return sendMessage
     */
    async sendLink(input) {
        try {
            await this.bot.sendChatAction(parseInt(input.chatId), telegramConfig.telegramMessageTypes.text.action);
            return await this.bot.sendMessage(parseInt(input.chatId), input.message, input.mode);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @description :: SendMessage
     * @param {object} input
     * @param {object} chat
     * @return sendMessage
     */
    async sendMention(input) {
        try {
            await this.bot.sendChatAction(parseInt(input.chatId), telegramConfig.telegramMessageTypes.text.action);
            return await this.bot.sendMessage(parseInt(input.chatId), input.message, input.mode);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @description :: SendMessage
     * @param {object} input
     * @param {object} chat
     * @return sendMessage
     */
    async sendTriggers(input) {
        try {
            await this.bot.sendChatAction(parseInt(input.chatId), telegramConfig.telegramMessageTypes.text.action);
            await this.bot.sendMessage(parseInt(input.chatId), input.message, input.mode);
            return true;
        } catch (err) {
            throw err;
        }
    }

    /**
     * 
     * @param {any} input 
     * @returns 
     */
    async start(input) {
        const { telegram, user } = input;
        try {
            await this.bot.sendChatAction(parseInt(telegram.chat.id), telegramConfig.telegramMessageTypes.text.action);
            await this.bot.sendMessage(
                parseInt(telegram.chat.id),
                `wellcom ${user.telegram.username} to sbon promoto`,
                {
                    "parse_mode": "HTML",
                    "reply_markup": {
                        "inline_keyboard": [
                            [
                                {
                                    "text": "لیست ها",
                                    "callback_data": `/getList`
                                }
                            ]
                        ]
                    }
                });
            return true;
        } catch (err) {
            throw err;
        }
    }


    /**
     * 
     * @param {any} input 
     * @returns 
     */
    async getList(input) {
        const { chatId, user, list } = input;
        try {
            let mode = { reply_markup: { inline_keyboard: [[]] } };
            for (let item of list) {
                mode.reply_markup.inline_keyboard[0].push({
                    text: item.name,
                    callback_data: `/showProduct-${item._id}`,
                });
            }
            await this.bot.sendChatAction(parseInt(chatId), telegramConfig.telegramMessageTypes.text.action);
            await this.bot.sendMessage(
                parseInt(chatId),
                `${user.telegram.username} lists menu`,
                mode
            );
            return true;
        } catch (err) {
            throw err;
        }
    }

    async showProduct(input) {
        const { chatId, products } = input;
        try {
            let i = 1;
            for (let item of products) {
                for (let index of item.skus) {
                    let text = `
                    /product \n row : ${i++} , \n title : ${item.titleFa || item.titleEn} , \n name: ${index.name} , \n price: ${index.price} , \n sbon: ${index.sbon} , \n productId: ${item._id} , \n skuId: ${index._id} 
                    `;
                    await this.bot.sendChatAction(parseInt(chatId), telegramConfig.telegramMessageTypes.text.action);
                    await this.bot.sendMessage(parseInt(chatId), text, { parse_mode: 'HTML' });
                }
            }
            return true;
        } catch (err) {
            throw err;
        }
    }
};

export default TelegramHelper;