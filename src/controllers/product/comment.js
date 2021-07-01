
// Models
import CommentModel from "./../../models/product/comment";

// Helper
import MongoHelper from "./../../helpers/mongo";
import ResponseGenerator from "./../../helpers/response";

// Consts
const COMMENT = 'comment';
const Response = new ResponseGenerator('comment-service');
const METHODS = {
  CREATE: 'create',
  FIND: 'find',
  FIND_PUBLIC: 'find-public',
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
export default class Comment {

  /**
   * @description :: Get Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async findPublic(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, COMMENT);
      const result = await CommentModel.paginate({ ...where, status: 1 }, options);
      return reply.send(
        Response.generator(200, result, METHODS.FIND_PUBLIC, req.executionTime)
      );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.FIND_PUBLIC, req.executionTime, err)
      );
    }
  }

  /**
   * @description :: Get Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async find(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, COMMENT);
      if (req.user.type === 0) {
        Object.assign(where, { userId: req.user._id });
      }
      const result = await CommentModel.paginate(where, options);
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
      const { where, options } = MongoHelper.initialMongoQuery(req.query, COMMENT);
      const result = await CommentModel.paginate({ ...where, _id: req.params.id }, options);
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
      const result = await CommentModel.create({ ...req.body, userId: req.user._id });
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
      const result = await CommentModel.findOneAndUpdate({
        _id: req.params.id,
      },
        req.body,
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
      const { id } = req.params;
      const result = await CommentModel.findOneAndDelete({ id });
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