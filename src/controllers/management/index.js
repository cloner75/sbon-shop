// Packages
import { parseAsync } from 'json2csv';

// Models
import ProductModel from './../../models/product/product';

// Helper
import MongoHelper from "./../../helpers/mongo";
import ResponseGenerator from './../../helpers/response';

// Consts
const MANAGEMENT = 'management';
const opts = {
  fields: [
    'name_fa',
    'name_en',
    'sub_name',
    'price',
    'discount',
    'stock',
    'sbon',
    'id',
    'skus_id',
  ]
};
const METHODS = {
  PRODUCT_CSV: 'getProductsCsv'
};
const Response = new ResponseGenerator('management-service');
/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class ManagementController {

  /**
   * @description :: Create Csv File Of All Products Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async getProductsCsv(req, reply) {
    try {
      const { options } = MongoHelper.initialMongoQuery({
        order: 'skus.stock',
        sort: 'DESC'
      }, 'product');
      const products = await ProductModel.paginate({}, options);
      let jsonData = [];
      products.map(product =>
        product.skus.map(sku => {
          jsonData.push({
            'name_fa': product.titleFa,
            'name_en': product.titleEn,
            'sub_name': sku.name,
            'price': sku.price,
            'discount': sku.discount,
            'stock': sku.stock,
            'sbon': sku.sbon,
            'id': product._id,
            'skus_id': sku._id
          });
        })
      );
      return reply
        .type('text/csv')
        .header('Content-Disposition', `attachment; filename=allproducts.csv`)
        .send(
          Buffer.from(
            await parseAsync(jsonData, opts), 'utf8')
        );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.PRODUCT_CSV, req.executionTime, err)
      );
    }
  }
}