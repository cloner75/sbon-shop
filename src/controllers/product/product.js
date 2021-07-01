
// Models
import ProductModel from "./../../models/product/product";

// Helper
import MongoHelper from "./../../helpers/mongo";
import ResponseGenerator from "./../../helpers/response";

// Consts
const Response = new ResponseGenerator('product-service');
const PRODUCT = 'product';
const METHODS = {
  CREATE: 'create',
  FIND: 'find',
  SEARCH: 'search',
  FIND_ONE: 'find-one',
  REMOVE: 'remove',
  UPDATE: 'update'
};
/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class Product {

  /**
   * @description :: Get Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async find(req, reply) {
    try {
      const { productsId, ...query } = req.query;
      const { where, options } = MongoHelper.initialMongoQuery(query, PRODUCT);
      if (productsId) {
        const ids = productsId.split(',').filter(item => /^[0-9a-fA-F]{24}$/.test(item.trim()));
        Object.assign(where, { _id: { $in: ids } });
      }
      const result = await ProductModel.paginate({ ...where, status: { $ne: 4 } }, options);
      return reply.send(
        Response.generator(200, result, METHODS.FIND, req.executionTime)
      );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.FIND, req.executionTime, err)
      );
    }
  }

  /**
  * @description :: Search Documents
  * @param {request} req 
  * @param {Reply} reply 
  */
  async search(req, reply) {
    try {
      const { type, title, brandId, categoriesId, priceMin, priceMax } = req.query;
      let searchBox = {};
      switch (type) {
        case 2:
          searchBox = {
            status: { $ne: 4 },
            'skus.price': {
              $gte: (priceMin - ((priceMin * 5) / 100)) || 0,
              $lte: (priceMax + ((priceMax * 5) / 100)) || 50000000000,
            }
          };
          if (categoriesId) {
            Object.assign(searchBox, { categoriesId: { $in: categoriesId.split(',') } });
          }

          if (brandId) {
            Object.assign(searchBox, { brandId: { $in: brandId.split(',') } });
          }
          if (title) {
            Object.assign(searchBox, {
              $or: [
                { titleFa: { $regex: new RegExp('.*' + title + '.*', "i") } },
                { titleEn: { $regex: new RegExp('.*' + title + '.*', "i") } }
              ],
            });
          }
          break;
        case 1:
          if (!title) {
            return res.status(422).send(
              Response.generator(422, {}, METHODS.SEARCH, req.executionTime)
            );
          }
          Object.assign(searchBox, {
            $or: [
              { titleFa: { $regex: new RegExp('.*' + title + '.*', "i") } },
              { titleEn: { $regex: new RegExp('.*' + title + '.*', "i") } }
            ],
          });
          break;
      }
      const { options } = MongoHelper.initialMongoQuery(req.query, PRODUCT);
      const result = await ProductModel.paginate(searchBox, options);
      return reply.send(
        Response.generator(200, result, METHODS.SEARCH, req.executionTime)
      );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.SEARCH, req.executionTime, err)
      );
    }
  }

  /**
   * @description :: Get One Document
   * @param {request} req 
   * @param {Reply} reply 
  */
  async findOne(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, PRODUCT);
      const result = await ProductModel.paginate({ ...where, status: { $ne: 4 }, _id: req.params.id }, options);
      return reply.send(
        Response.generator(200, result, METHODS.FIND_ONE, req.executionTime)
      );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.FIND_ONE, req.executionTime, err)
      );
    }
  }

  /**
   * @description :: Create Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async create(req, reply) {
    try {
      const result = await ProductModel.create({ ...req.body, ownerId: req.user._id });
      return reply.status(200).send(
        Response.generator(200, result, METHODS.CREATE, req.executionTime)
      );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.CREATE, req.executionTime, err)
      );
    }
  }

  /**
   * @description :: update Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async update(req, reply) {
    try {
      const result = await ProductModel.findOneAndUpdate({
        _id: req.params.id,
      },
        { ...req.body, ownerId: req.user._id },
        { new: true }
      );
      return result ?
        reply.status(200).send(
          Response.generator(200, result, METHODS.UPDATE, req.executionTime)
        ) :
        reply.status(404).send(
          Response.generator(404, {})
        );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.UPDATE, req.executionTime, err)
      );
    }
  }

  /**
   * @description :: Remove Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async remove(req, reply) {
    try {
      const { id } = req.params;
      const result = await ProductModel.findOneAndUpdate({ _id: id }, { ownerId: req.user._id, status: 4 });
      return result ?
        reply.status(200).send(
          Response.generator(200, result, METHODS.REMOVE, req.executionTime)
        ) :
        reply.status(404).send(
          Response.generator(404, {}, METHODS.REMOVE, req.executionTime)
        );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.REMOVE, req.executionTime, err)
      );
    }
  }
}
