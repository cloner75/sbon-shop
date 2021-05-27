// Packages
import TelegramHelper from './../../helpers/telegram';

// Models
import UserModel from './../../models/user/user';
import ListModel from './../../models/user/list';
import ProductModel from './../../models/product/product';

// Consts
const helper = new TelegramHelper(process.env.TOKEN_BOT);
const functions = {
    '/start': 'start',
    '/getList': 'getList',
    '/setPrice': 'setPrice',
    '/showProduct': 'showProduct'
};

class Telegram {
    /**
     * 
     * @param {request} req 
     * @param {reply} reply
     * @returns 
     */
    async webhook(req, reply) {
        try {
            const { message, callback_query } = req.body;
            if (message?.reply_to_message) {
                const responseText = {
                    price: Number(message.text.split(',')[0].split(':')[1]),
                    sbon: Number(message.text.split(',')[1].split(':')[1])
                };
                if (responseText.price && responseText.sbon) {
                    const replyText = message.reply_to_message.text;
                    const replyTextToArray = replyText.replace('/product', "").replace(/(\r\n|\n|\r)/gm, "").split(',');
                    let replyObject = {};
                    for (let item of replyTextToArray) {
                        Object.assign(replyObject, {
                            [item.split(':')[0].trim()]: item.split(':')[1].trim()
                        });
                    }
                    await ProductModel.updateOne(
                        { _id: replyObject.productId, 'skus._id': replyObject.skuId },
                        {
                            $set: {
                                'skus.$.price': Number(responseText.price),
                                'skus.$.sbon': Number(responseText.sbon),
                            }
                        }
                    );
                }
                return reply.send(true);
            }
            if (message) {
                const { chat, from, text } = req.body.message;
                // check user
                const getUser = await UserModel.findOneAndUpdate(
                    { 'telegram.id': chat.id },
                    {
                        $set: {
                            'telegram.first_name': from.first_name,
                            'telegram.username': from.username,
                            'telegram.type': from.type,
                        }
                    }, { new: true });
                if (!getUser) {
                    helper.sendText({ message: `forbidden access @${from.username}`, chatId: chat.id });
                    return reply.send('forbidden access');
                }
                // check message
                if (!text) {
                    helper.sendText({ message: 'please send text', chatId: chat.id });
                    return reply.send('send text');
                }

                const getList = await ListModel.find({ userId: getUser._id });

                // chose response
                if (text) {
                    if (Object.keys(functions).includes(text)) {
                        helper[functions[text]]({ telegram: req.body.message, user: getUser, list: getList });
                    } else {
                        helper.sendText({
                            message: 'قیمت جدید را وارد کنید',
                            chatId: chat.id,
                            mode: {
                                reply_markup: {
                                    parse_mode: "HTML",
                                }
                            }
                        });
                    }
                }
            } else if (callback_query) {
                const { from, data } = callback_query;
                const getUser = await UserModel.findOneAndUpdate(
                    { 'telegram.id': from.id },
                    {
                        $set: {
                            'telegram.first_name': from.first_name,
                            'telegram.username': from.username,
                            'telegram.type': from.type,
                        }
                    }, { new: true });
                if (!getUser) {
                    helper.sendText({ message: `forbidden access @${from.username}`, chatId: chat.id });
                    return reply.send('forbidden access');
                }
                const getList = await ListModel.find({ userId: getUser._id });

                if (data === '/showProduct' || data.split('-')[0] === '/showProduct') {
                    const selectList = await ListModel.findOne({ _id: data.split('-')[1] });
                    const products = await ProductModel.find({ _id: { $in: selectList.products } });
                    helper.showProduct({ chatId: from.id, products });
                } else if (Object.keys(functions).includes(data)) {
                    helper[functions[data]]({ chatId: from.id, telegram: req.body.message, user: getUser, list: getList });
                } else {
                    helper.sendText({ message: 'not found command', chatId: from.id });
                }
            }
            return reply.send('post');
        } catch (err) {
            console.log(err.message);
            return reply.send(err.message);
        }
    }
}

export default Telegram;