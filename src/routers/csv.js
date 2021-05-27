// Controller
import CsvController from './../controllers/csv';

// Consts
const Csv = new CsvController();

// Routes
export default (fastify, _opts, done) => {
    // Bot Routes
    fastify.get('/get/:userId/:listName', Csv.create);
    fastify.post('/update/file', Csv.update);
    fastify.post('/update', Csv.updateJSON);
    done();
};