// Packages

// Models
import WalletModel from './../../models/user/wallet';

// Helpers
import MongoHelper from './../../helpers/mongo';
import ResponseGenerator from './../../helpers/response';

// Consts
const WALLET = 'wallet';
const Response = new ResponseGenerator('wallet-service');
const METHODS = {
  FIND_ONE: 'find-one',
  CREATE: 'create',
};
/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class UserController {
  /**
   * @description :: Create Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async create(req, reply) {
    try {
      const createWallet = await WalletModel.create({
        userId: req.user._id,
        price: 0
      });
      return reply.status(201).send(
        Response.generator(201, createWallet, METHODS.CREATE, req.executionTime)
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
  async findOne(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, WALLET);
      const result = await WalletModel.paginate({
        userId: req.user._id,
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
}