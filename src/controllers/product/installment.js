
// Models
import InstallmentModel from "./../../models/product/installment";

// Helper
import MongoHelper from "./../../helpers/mongo";
import ResponseGenerator from "./../../helpers/response";

// Const
const Response = new ResponseGenerator('installment-service');
const INSTALLMENT = 'installment';
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
export default class Installment {

  /**
   * @description :: Get Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async find(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, INSTALLMENT);
      const result = await InstallmentModel.paginate(where, options);
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
      const { where, options } = MongoHelper.initialMongoQuery(req.query, INSTALLMENT);
      const result = await InstallmentModel.paginate({ ...where, _id: req.params.id }, options);
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
      const result = await InstallmentModel.create({ ...req.body, ownerId: req.user._id });
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
      const result = await InstallmentModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          plans: req.body.plans,
          categoryId: req.body.categoryId,
          ownerId: req.user._id
        },
        { new: true }
      );
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
      const result = await InstallmentModel.findOneAndDelete({ _id: req.params.id });
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