
// Models
import BrandModel from "./../../models/product/brand";

// Helper
import MongoHelper from "./../../helpers/mongo";
import ResponseGenerator from "./../../helpers/response";

// Const
const Response = new ResponseGenerator('brand-service');
const BRAND = 'brand';
const METHODS = {
  CREATE: 'create',
  FIND: 'find',
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
export default class Brand {

  /**
   * @description :: Get Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async find(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, BRAND);
      const result = await BrandModel.paginate(where, options);
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
      const { where, options } = MongoHelper.initialMongoQuery(req.query, BRAND);
      const result = await BrandModel.paginate({ ...where, _id: req.params.id }, options);
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
      const result = await BrandModel.create({ ...req.body, ownerId: req.user._id });
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
      const _id = req.params.id;
      const result = await BrandModel.findOneAndUpdate({ _id }, { ...req.body, ownerId: req.user._id }, { new: true });
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
      const _id = req.params.id;
      const result = await BrandModel.findOneAndDelete({ _id });
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