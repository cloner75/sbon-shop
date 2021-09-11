
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
  FIND_EMALLS: 'find-emalls',
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
      let { productsId, ...query } = req.query;
      if (!query.order && !query.sort) {
        Object.assign(query, {
          order: 'skus.stock',
          sort: 'DESC'
        });
      }
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
   * @description :: Get Documents For Emails Service
   * @param {request} req 
   * @param {Reply} reply 
   */
  async findEmalls(req, reply) {
    try {
      const { options } = MongoHelper.initialMongoQuery(req.query, PRODUCT);
      const where = {
        status: { $ne: 4 },
        'skus.default': true
      };
      const selectFields = '_id titleFa skus._id skus.default skus.price skus.stock skus.discount slug';
      const result = await ProductModel.paginate(where, {
        ...options,
        select: selectFields
      });
      const products = result.docs.map(item => {
        return {
          id: item.skus._id,
          title: item.titleFa,
          url: `/product/${item._id}/${item.slug}`,
          price: item.skus[0].price,
          old_price: item.skus[0].discount || null,
          is_available: item.skus[0].stock > 0 ? true : false,
        };
      });
      return reply.send(
        Response.generator(200, { products, total: result.total }, METHODS.FIND_EMALLS, req.executionTime)
      );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.FIND_EMALLS, req.executionTime, err)
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
      Object.assign(searchBox, { status: { $ne: 4 } });
      if (!req.query.order && !req.query.sort) {
        Object.assign(req.query, {
          order: 'skus.stock',
          sort: 'DESC'
        });
      s}
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
      const getLastProduct = await ProductModel.findOne({}, {}, { sort: { 'createdAt': -1 } });
      let shortid = 'sbn-20000';
      if (getLastProduct) {
        shortid = 'sbn-' + (Number(getLastProduct.shortid.split('-')[1]) + 1);
      }
      const result = await ProductModel.create({ ...req.body, shortid, ownerId: req.user._id });
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

  /**
   * @description :: update shortid
   * @param {request} req 
   * @param {reply} reply 
   * @returns 
   */
  async updateShortid(req, reply) {
    try {
      const result = await ProductModel.find({});
      let shortid = 20000;
      for (let item of result) {
        const test = await ProductModel.updateOne({ _id: item._id }, { $set: { shortid: 'sbn-' + shortid++ } });
      }
      return reply.status(200).send(
        Response.generator(200, result, 'updateShortid', req.executionTime)
      );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler('updateShortid', req.executionTime, err)
      );
    }
  }


  /**
   * @description :: redirect shortlink
   * @param {request} req 
   * @param {reply} reply 
   * @returns 
   */
  async redirectShortLink(req, reply) {
    try {
      const { shortid } = req.params;
      let getUrl = await ProductModel.findOne({ shortid });
      return reply.status(301).redirect(getUrl ? `/${getUrl._id}/${getUrl.slug}` : '/search');
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler('updateShortid', req.executionTime, err)
      );
    }
  }


}
