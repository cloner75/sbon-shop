// Controller
import ManagementController from './../controllers/management';

// Consts
const Management = new ManagementController();

// Routes
export default (fastify, _opts, done) => {
  // Management Routes
  fastify.get('/get/products/cvs', Management.getProductsCsv);
  done();
};
