// Packages

// Models
import ListModel from './../../models/user/list';

// Helpers
import MongoHelper from './../../helpers/mongo';
import ResponseGenerator from './../../helpers/response';

// Consts
const LIST = 'list';
const Response = new ResponseGenerator('list-service');
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
export default class ListController {
  /**
   * @description :: Create Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async create(req, reply) {
    try {
      const createWallet = await ListModel.create({
        userId: req.user._id,
        ...req.body
      });
      return reply.status(201).send(Response.generator(201, createWallet));
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.CREATE, req.executionTime, err)
      );
    }
  }

  /**
  * @description :: Get One Document
  * @param {request} req 
  * @param {Reply} reply 
  */
  async find(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, LIST);
      const result = await ListModel.paginate({
        userId: req.user._id,
        ...where
      }, options);

      return result.docs[0] ?
        reply.status(200).send(Response.generator(200, result.docs)) :
        reply.status(404).send(Response.generator(404));
    } catch (err) {
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
  * @description :: Get One Document
  * @param {request} req 
  * @param {Reply} reply 
  */
  async findOne(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, LIST);
      const result = await ListModel.paginate({
        userId: req.user._id,
        ...where,
        _id: req.params.id
      }, options);

      return result.docs[0] ?
        reply.status(200).send(Response.generator(200, result.docs[0])) :
        reply.status(404).send(Response.generator(404));
    } catch (err) {
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
   * @description :: update Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async update(req, reply) {
    try {
      const update = await ListModel.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
        }
      );
      if (update) {
        return reply.send(Response.generator(200, update));
      }
      return reply.status(404).send(Response.generator(404));
    } catch (err) {
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }


  /**
   * @todo :: Remove Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async remove(req, reply) {
    try {
      const update = await ListModel.deleteOne(
        { _id: req.params.id },
      );
      if (update) {
        return reply.send(Response.generator(200, update));
      }
      return reply.status(404).send(Response.generator(404));
    } catch (err) {
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }
}