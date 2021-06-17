// Controllers
import UserController from '../controllers/user/user';
import WalletController from './../controllers/user/wallet';
import OrderController from './../controllers/user/order';
import ListController from './../controllers/user/list';

// Controller
const User = new UserController();
const Wallet = new WalletController();
const Order = new OrderController;
const List = new ListController;

// Midds
import Midd from './../middlewares/user';

// Hookes
import Hooks from './../helpers/hooks';

// Consts

// Routes
export default (fastify, _opts, done) => {
    // Hooks
    fastify.addHook('onRequest', Hooks.authorization);

    // User Routes
    fastify.post('/code/send', Midd.hotpSend, User.hotpSend);
    fastify.post('/code/check', Midd.hotpVerify, User.hotpVerify);

    fastify.post('/register', Midd.register, User.register);
    fastify.post('/login', Midd.login, User.login);
    fastify.post('/token/refresh', User.refreshToken);

    fastify.get('/', Midd.find, User.find);
    fastify.get('/:id', Midd.findOne, User.findOne);
    fastify.get('/comment', Midd.findOneForComment, User.findOneForComment);

    fastify.put('/profile/location', User.updateLocation);
    fastify.put('/profile/telegram', Midd.updateTelegramToken, User.updateTelegramToken);
    fastify.put('/profile/:id', Midd.update, User.update);
    fastify.put('/superadmin/update/:id', Midd.update, User.update);

    fastify.delete('/superadmin/remove/:id', Midd.delete, User.remove);

    // Wallet Routes
    fastify.get('/wallet/get', Wallet.findOne);
    fastify.post('/wallet/create', Wallet.create);

    // by transaction 
    // fastify.put('/wallet/update', Wallet.update);

    // Order Routes
    fastify.post('/order/create', Order.create);
    fastify.get('/order/get', Order.find);
    fastify.put('/order/cancel/:orderId', Order.cancelOrder);

    // fastify.post('/order/payment/pay', Order.pay);
    fastify.post('/order/payment/get/token', Order.pay);
    fastify.post('/order/verify', Order.verify);

    // fastify.post('/order/payment/pay', Order.pay);
    fastify.post('/list/create', Midd.list.create, List.create);
    fastify.get('/list/get', Midd.list.find, List.find);
    fastify.get('/list/get/:id', Midd.list.findOne, List.findOne);
    fastify.put('/list/update/:id', Midd.list.update, List.update);
    fastify.delete('/list/remove/:id', Midd.list.delete, List.remove);

    done();
};
