// Controller
import TelegramController from './../controllers/telegram/telegram';

// Consts
const Telegram = new TelegramController();

// Routes
export default (fastify, _opts, done) => {
    // Bot Routes
    fastify.post('/webhook', Telegram.webhook);
    done();
};
