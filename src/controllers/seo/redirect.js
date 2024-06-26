// Packages

// Models
import Models from './../../models';

// Helpers
import MongoHelper from './../../helpers/mongo';
import ResponseGenerator from './../../helpers/response';


// Consts
const REDIRECT = 'redirect';
const Response = new ResponseGenerator('redirect-service');
const METHODS = {
  CREATE: 'create',
  FIND: 'find',
  FIND_ONE: 'find-one',
  FIND_SUPER_ADMIN:'find-super-admin',
  REMOVE: 'remove',
  UPDATE: 'update',
};

/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class RedirectController {
  /**
   * @description :: Create Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async create(req, reply) {
    try {
      const { page, target, code } = req.body;
      const createOption = await Models.redirect.create({
        userId: req.user._id,
        page,
        target,
        code,
      });
      return reply.status(201).send(
        Response.generator(201, createOption, METHODS.CREATE, req.executionTime)
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
      const { where, options } = MongoHelper.initialMongoQuery(req.query, REDIRECT);
      const result = await Models.redirect.paginate({
        page: req.query.page,
        ...where
      }, options);
      return result.docs[0] ?
        reply.status(200).send(
          Response.generator(200, result.docs[0], METHODS.FIND_ONE, req.executionTime)
        ) :
        reply.status(404).send(
          Response.generator(404, {}, METHODS.FIND_ONE, req.executionTime)
        );
    } catch (err) {
      // console.log(err);
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.FIND_ONE, req.executionTime, err)
      );
    }
  }


  /**
  * @description :: Get One Document
  * @param {request} req 
  * @param {Reply} reply 
  */
  async superadminFind(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, REDIRECT);
      const result = await Models.redirect.paginate({ ...where }, options);
      return reply.status(200).send(
        Response.generator(200, result.docs, METHODS.FIND_SUPER_ADMIN, req.executionTime)
      );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.FIND_ONE, req.executionTime, err)
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
      const { where, options } = MongoHelper.initialMongoQuery(req.query, REDIRECT);
      const result = await Models.redirect.paginate({
        _id: req.params.id,
        ...where
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
      const update = await Models.redirect.findOneAndUpdate(
        {
          _id: req.params.id
        },
        { ...req.body, userId: req.user._id },
        {
          new: true,
        }
      );
      return update ?
        reply.send(
          Response.generator(200, update, METHODS.UPDATE, req.executionTime)
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
   * @description :: Delete Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async remove(req, reply) {
    try {
      const remove = await Models.redirect.deleteOne(
        { _id: req.params.id },
      );
      return remove.n ?
        reply.send(
          Response.generator(200, {}, METHODS.REMOVE, req.executionTime)
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