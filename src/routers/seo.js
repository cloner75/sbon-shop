// Controllers
import MetaController from './../controllers/seo/meta';
import RedirectController from './../controllers/seo/redirect';

// Controller
const Meta = new MetaController();
const Redirect = new RedirectController();

// Hookes
import Hooks from '../helpers/hooks';

// Consts

// Routes
export default (fastify, _opts, done) => {
  // Hooks
  fastify.addHook('onRequest', Hooks.authorization);

  // Meta Routes
  fastify.post('/meta/create', Meta.create);
  fastify.put('/meta/update/:id', Meta.update);
  fastify.delete('/meta/remove/:id', Meta.remove);
  fastify.get('/meta/find', Meta.findOneByName);
  fastify.get('/meta/find/:id', Meta.findOneById);
  fastify.get('/meta/superadmin/find', Meta.findAdmin);

  // Redirect Routes
  fastify.get('/redirect/find', Redirect.find);
  fastify.get('/redirect/find/:id', Redirect.findOne);
  fastify.post('/redirect/create', Redirect.create);
  fastify.put('/redirect/update/:id', Redirect.update);
  fastify.delete('/redirect/remove/:id', Redirect.remove);

  done();
};
