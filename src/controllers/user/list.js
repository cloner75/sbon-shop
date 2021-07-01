// Packages

// Models
import ListModel from './../../models/user/list';

// Helpers
import MongoHelper from './../../helpers/mongo';
import ResponseGenerator from './../../helpers/response';

// Consts
const Response = new ResponseGenerator('list-service');
const LIST = 'list';
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
      const createList = await ListModel.create({
        userId: req.user._id,
        ...req.body
      });
      return reply.status(201).send(
        Response.generator(201, createList, METHODS.CREATE, req.executionTime)
      );
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
        reply.status(200).send(
          Response.generator(200, result.docs, METHODS.FIND, req.executionTime)
        ) :
        reply.status(404).send(
          Response.generator(404, {}, METHODS.FIND, req.executionTime)
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
      const { where, options } = MongoHelper.initialMongoQuery(req.query, LIST);
      const result = await ListModel.paginate({
        userId: req.user._id,
        ...where,
        _id: req.params.id
      }, options);

      return result.docs[0] ?
        reply.status(200).send(
          Response.generator(200, result.docs[0], METHODS.FIND_ONE, req.executionTime)
        ) :
        reply.status(404).send(
          Response.generator(404, {}, METHODS.FIND_ONE, req.executionTime)
        );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.FIND_ONE, req.executionTime, err)
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
      const update = await ListModel.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
        }
      );
      if (update) {
        return reply.send(
          Response.generator(200, update, METHODS.UPDATE, req.executionTime)
        );
      }
      return reply.status(404).send(
        Response.generator(404, {}, METHODS.UPDATE, req.executionTime)
      );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.UPDATE, req.executionTime, err)
      );
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
        return reply.send(
          Response.generator(200, update, METHODS.REMOVE, req.executionTime)
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