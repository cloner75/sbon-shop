// Controller
import CsvController from './../controllers/csv';

// Consts
const Csv = new CsvController();

// Routes
export default (fastify, _opts, done) => {
  // Bot Routes
  // fastify.get('/get/:userId/:listName', Csv.create);
  // fastify.post('/update/file', Csv.update);
  fastify.post('/update', {
    schema: {
      description: 'Update Products With Array<JSON>',
      tags: ['csv-routes'],
      summary: 'update products collection with json',
      body: {
        type: 'object',
        required: ['products'],
        properties: {
          products: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'skus_id', 'price', 'sbon', 'stock', 'discount', 'vipPrice'],
              properties: {
                id: { type: 'string', pattern: "^[0-9a-fA-F]{24}$" },
                skus_id: { type: 'string', pattern: "^[0-9a-fA-F]{24}$" },
                price: { type: 'integer' },
                sbon: { type: 'integer' },
                stock: { type: 'integer' },
                discount: { type: 'integer' },
                vipPrice: { type: 'integer' },
              }
            }
          },
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  skus_id: { type: 'string' },
                  price: { type: 'integer' },
                  sbon: { type: 'integer' },
                  stock: { type: 'integer' },
                  discount: { type: 'integer' },
                  vipPrice: { type: 'integer' },
                }
              }
            },
          }
        }
      },
      headers: {
        type: 'object',
        properties: {
          'authorization': { type: 'string' }
        },
        required: ['authorization']
      }
    }
  }, Csv.updateJSON);
  done();
};