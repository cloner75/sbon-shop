// Controller
import MinishopController from './../controllers/minishop/template';

// Consts
const Minishop = new MinishopController();

// Routes
export default (fastify, _opts, done) => {
  // Minishop Routes
  fastify.post('/create', Minishop.create);
  fastify.get('/get', Minishop.find);
  fastify.get('/get/:id', Minishop.findOne);
  fastify.put('/update/:id', Minishop.update);
  fastify.delete('/remove/:id', Minishop.remove);
  done();
};
