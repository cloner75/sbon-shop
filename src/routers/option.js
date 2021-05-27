// Controllers
import OptionController from '../controllers/option';

// Controller
const Option = new OptionController();

// Midds
import Midd from './../middlewares/option';

// Hookes
import Hooks from './../helpers/hooks';

// Consts
const url = '/api/v1/option';
// Routes
export default (fastify, _opts, done) => {
    // Hooks
    fastify.addHook('onRequest', Hooks.authorization);

    // User Routes
    fastify.post('/create', Midd.create, Option.create);
    fastify.get('/get', Midd.find, Option.find);
    fastify.get('/get/:id', Midd.findOne, Option.findOne);
    fastify.put('/update/:id', Midd.update, Option.update);
    fastify.delete('/remove/:id', Midd.delete, Option.remove);
    done();
};


