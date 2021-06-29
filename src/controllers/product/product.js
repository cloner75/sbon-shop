
// Models
import ProductModel from "./../../models/product/product";

// Helper
import MongoHelper from "./../../helpers/mongo";
import Response from "./../../helpers/response";
import Logger from "./../../helpers/logger";

// Consts
const PRODUCT = 'product';

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
    const start = Date.now();
    try {
      const { productsId, ...query } = req.query;
      const { where, options } = MongoHelper.initialMongoQuery(query, PRODUCT);
      if (productsId) {
        const ids = productsId.split(',').filter(item => /^[0-9a-fA-F]{24}$/.test(item.trim()));
        Object.assign(where, { _id: { $in: ids } });
      }
      const result = await ProductModel.paginate({ ...where, status: { $ne: 4 } }, options);
      Logger.info({
        controller: 'Product',
        api: 'find',
        isSuccess: true,
        ip: req.clientIp,
        message: '200',
        time: Date.now() - start
      });
      return reply.send(Response.generator(200, result));
    } catch (err) {
      Logger.error({
        controller: 'Product',
        api: 'find',
        isSuccess: false,
        ip: req.clientIp,
        message: err.message,
        time: Date.now() - start
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
  * @description :: Search Documents
  * @param {request} req 
  * @param {Reply} reply 
  */
  async search(req, reply) {
    const start = Date.now();
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
            return res.status(422).send(Response.generator(422));
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
      Logger.info({
        controller: 'Product',
        api: 'find',
        isSuccess: true,
        ip: req.clientIp,
        message: '200',
        time: Date.now() - start
      });
      return reply.send(Response.generator(200, result));
    } catch (err) {
      Logger.error({
        controller: 'Product',
        api: 'find',
        isSuccess: false,
        ip: req.clientIp,
        message: err.message,
        time: Date.now() - start
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
   * @description :: Get One Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async findOne(req, reply) {
    const start = Date.now();
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, PRODUCT);

      const result = await ProductModel.paginate({ ...where, status: { $ne: 4 }, _id: req.params.id }, options);
      Logger.info({
        controller: 'Product',
        api: 'findOne',
        isSuccess: true,
        ip: req.clientIp,
        message: '200',
        time: Date.now() - start
      });
      return reply.send(Response.generator(200, result));
    } catch (err) {
      Logger.error({
        controller: 'Product',
        api: 'findOne',
        isSuccess: false,
        ip: req.clientIp,
        message: err.message,
        time: Date.now() - start
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
   * @description :: Create Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async create(req, reply) {
    const start = Date.now();
    try {
      const result = await ProductModel.create({ ...req.body, ownerId: req.user._id });
      Logger.info({
        controller: 'Product',
        api: 'create',
        isSuccess: true,
        ip: req.clientIp,
        message: '200',
        time: Date.now() - start
      });
      return reply.status(200).send(Response.generator(200, result));
    } catch (err) {
      Logger.error({
        controller: 'Product',
        api: 'create',
        isSuccess: true,
        ip: req.clientIp,
        message: '200',
        time: Date.now() - start
      });
      return reply.status(500).send(err);
    }
  }

  /**
   * @description :: update Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async update(req, reply) {
    const start = Date.now();
    try {
      const result = await ProductModel.findOneAndUpdate({
        _id: req.params.id,
        // minishop: req.user.minishop
      },
        { ...req.body, ownerId: req.user._id },
        { new: true }
      );
      Logger.info({
        controller: 'Product',
        api: 'update',
        isSuccess: true,
        ip: req.clientIp,
        message: '200',
        time: Date.now() - start
      });
      return result ?
        reply.status(200).send(Response.generator(200, result)) :
        reply.status(404).send(Response.generator(404));
    } catch (err) {
      Logger.error({
        controller: 'Product',
        api: 'update',
        isSuccess: true,
        ip: req.clientIp,
        message: '200',
        time: Date.now() - start
      });
      return reply.status(500).send(err);
    }
  }

  /**
   * @description :: Remove Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async remove(req, reply) {
    const start = Date.now();
    try {
      const { id } = req.params;
      const result = await ProductModel.findOneAndUpdate({ _id: id }, { ownerId: req.user._id, status: 4 });
      Logger.info({
        controller: 'Product',
        api: 'remove',
        isSuccess: true,
        ip: req.clientIp,
        message: '200',
        time: Date.now() - start
      });
      return result ?
        reply.status(200).send(Response.generator(200, result)) :
        reply.status(404).send(Response.generator(404));
    } catch (err) {
      Logger.info({
        controller: 'Product',
        api: 'remove',
        isSuccess: true,
        ip: req.clientIp,
        message: '200',
        time: Date.now() - start
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }
}
