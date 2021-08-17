// Controllers
import OrderController from '../controllers/user/order';

// Controller
const Order = new OrderController;


// Hookes
import Hooks from '../helpers/hooks';


// Routes
export default (fastify, _opts, done) => {
    // Hooks
    fastify.addHook('onRequest', Hooks.authorization);

    fastify.post('/:orderId', Order.update);
    fastify.get('/:orderId', Order.update);

    done();
};
