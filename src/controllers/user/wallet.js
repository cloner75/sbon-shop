// Packages

// Models
import WalletModel from './../../models/user/wallet';

// Helpers
import MongoHelper from './../../helpers/mongo';
import ResponseGenerator from './../../helpers/response';

// Configs
import configs from './../../configs/config';


// Consts
const WALLET = 'wallet';
const Response = new ResponseGenerator('order-service');
const METHODS = {
  FIND: 'find',
  FIND_ONE: 'find-one',
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
      return reply.status(201).send(Response.generator(201, createWallet));
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
      const { where, options } = MongoHelper.initialMongoQuery(req.query, WALLET);
      const result = await WalletModel.paginate({
        userId: req.user._id,
        ...where
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
      const { password, ...result } = req.body;
      if (password) {
        const salt = await bcrypt.genSaltSync(configs.bcrypt.saltRound);
        const hash = await bcrypt.hashSync(password, salt);
        Object.assign(result, {
          password: hash,
          salt
        });
      }
      const update = await WalletModel.findOneAndUpdate(
        { _id: req.params.id },
        result,
        {
          new: true,
          fields: { password: 0, salt: 0 },
        }
      );
      if (update) {
        delete update.password;
        delete update.salt;
        return reply.send(Response.generator(200, update));
      }
      return reply.status(404).send(Response.generator(404));
    } catch (err) {
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }
}