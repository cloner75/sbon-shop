
// Models
import CategoryModel from "./../../models/product/category";

// Helper
import MongoHelper from "./../../helpers/mongo";
import ResponseGenerator from "./../../helpers/response";

// Const
const Response = new ResponseGenerator('category-service');
const CATEGORY = 'category';
const METHODS = {
  CREATE: 'create',
  FIND: 'find',
  FIND_ONE: 'find-one',
  REMOVE: 'remove',
  UPDATE: 'update'
};

function getIndex(input, where) {
  let result = null;
  for (let item of input) {
    if (item.slug && item.slug === where) {
      result = item;
      break;
    } else {
      for (let itemLevel2 of item.sub) {
        if (itemLevel2.slug && itemLevel2.slug === where) {
          result = itemLevel2;
          break;
        } else {
          for (let itemLevel3 of itemLevel2.sub) {
            if (itemLevel3.slug && itemLevel3.slug === where) {
              result = itemLevel3;
              break;
            }
          }
        }
      }
    }
  }
  return result;
}


/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class Category {

  /**
   * @description :: Get Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async find(req, reply) {
    try {
      const { slug, ...rest } = req.query;
      const { where, options } = MongoHelper.initialMongoQuery(rest, CATEGORY);
      let result = await CategoryModel.paginate(where, options);
      if (slug) {
        result = getIndex(result.docs, slug);
      }
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
   * @description :: Get One Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async findOne(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, CATEGORY);
      const result = await CategoryModel.paginate({ ...where, _id: req.params.id }, options);
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
      const result = await CategoryModel.create({ ...req.body, ownerId: req.user._id });
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
      const { sub, description, name, image, banner } = req.body;
      const _id = req.params.id;
      const data = {
        name,
        sub,
        image,
        banner,
        ownerId: req.user._id
      };
      if (description) {
        Object.assign(data, { description });
      }
      const result = await CategoryModel.findOneAndUpdate({ _id }, data, { new: true });
      return result ?
        reply.status(200).send(
          Response.generator(200, result, METHODS.UPDATE, req.executionTime)
        ) :
        reply.status(404).send(
          Response.generator(404, {}, METHODS.UPDATE, req.executionTime)
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
      const result = await CategoryModel.findOneAndDelete({ _id: req.params.id });
      if (result) {
        return reply.status(200).send(
          Response.generator(200, result, METHODS.REMOVE, req.executionTime)
        );
      }
      return reply.status(404).send(
        Response.generator(404, {}, METHODS.REMOVE, req.executionTime)
      );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.REMOVE, req.executionTime, err)
      );
    }
  }
}