// Controllers
import MrLottoryController from '../controllers/mrlottory';

// Controller
const MrLottory = new MrLottoryController();

// Midds
import Midd from './../middlewares/mrLottory';

// Hookes
import Hooks from './../helpers/hooks';

// Routes
export default (fastify, _opts, done) => {
  // Hooks
  fastify.addHook('onRequest', Hooks.authorization);

  // User Routes
  fastify.post('/create', Midd.create, MrLottory.createUser);
  fastify.post('/verify', Midd.verify, MrLottory.verify);
  // fastify.get('/get', Midd.find, Option.find);
  done();
};


